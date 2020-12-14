const Tag = 'note';
const Mongo = require('../fmbt/db/mongo');
const CodeMsg = require('../fmbt/code-msg');
const Exception = require('../fmbt/exception');
const HtmlUtil = require('../fmbt/util/html');
const Bus = require('../fmbt/bus');
const VS = require('../fmbt/validator')(Tag);
const TimeLock = require('../fmbt/util/timelock')(Tag);
const EsNote = require('./es-note');
const Share = require('./share');

const schemaDefinition = {
    // 比较名小于30
    name: {
        type: String,
        required: true
    },
    private: {
        type: Boolean,
        required: true,
        default: true
    },
    statics: {
        pv: {
            type: Number,
            default: 0
        },
        great: {
            type: Number,
            default: 0
        }
    },
    // 描述
    summary: {
        type: String,
        default: ''
    },
    firstImg: {
        type: String,
        default: ''
    },
    preview: {
        type: String,
        default: ''
    },
    inUse: {
        type: Boolean,
        index: true,
        required: true,
        default: true
    },
    // 所有者id
    userId: {
        index: true,
        type: String,
        required: true
    },
    folderId: {
        index: true,
        type: String,
        required: true
    },
    // 次序
    index: {
        type: Number,
        default: 0
    },
    md: {
        type: String,
        default: ''
    },
    time: {
        create: {
            type: Number,
            default() {
                return Date.now()
            }
        },
        update: {
            type: Number,
            default() {
                return Date.now()
            }
        },
        remove: {
            type: Number
        }
    }
};
VS.NoteMove = {
    noteId: {
        required: true
    },
    oldFolderId: {
        required: true
    },
    newFolderId: {
        required: true
    }
};
VS.NoteName = {
    name: [
        {
            required: true
        },
        {
            max: 39,
            message: '标题过长>=40'
        }
    ]
};
VS.PrivateNoteId = {
    noteId: {
        required: true
    },
    private: {
        required: true
    }
};
VS.GetBlogNoteNeighbor = {
    noteId: {
        required: true
    },
    folderId: {
        required: true
    },
    index: {
        required: true
    }
};
VS.CreateLink = {
    noteId: {
        required: true
    },
    expireDays: {
        type: 'number',
        required: true
    }
};
function convertTimeUpdate(update) {
    update.time = {update: update['time.update']};
    delete update['time.update'];
    return update;
}

class Note extends Mongo {
    async share(user, params) {
        if (user) {
            let userId = user._id;
            let {noteId, expireDays} = await VS.CreateLink.doValidate(params);
            let count = await this.count({_id: noteId, userId});
            if (count > 0) {
                return Share.createLink(user._id, noteId, expireDays);
            }
        } else {
            throw new Exception(CodeMsg.NotEnoughAuth('尚未登录'));
        }
    }

    // main.html中展开某个目录下的，一开始的初始化调用，或者无条件搜索下展开第一个目录调用
    myOfFolder(folderId, fields) {
        return this.find({folderId, inUse: true}, {'index': 1}, fields);
    }

    // 1. main.html中自己使用带关键词的搜索（main.html）
    // 2. main.html中导出
    mySearch(my, condition, fields) {
        condition.userId = my._id;
        if (condition.keys) {
            if (fields) {
                condition._source = Object.keys(fields);
            }
            return EsNote.searchPage(condition, {current: 1, size: 10000});
        } else {
            if (condition.folderIds) {
                condition.folderId = {$in: condition.folderIds};
                delete condition.folderIds;
            }
            return this.find(condition, {index: 1}, fields);
        }
    }

    // 不带my的是其他人调用，限定了private false
    // blog.html
    async searchPage(condition, page) {
        let {userId, keys, checkAll, folderIds} = condition;
        if (keys) {
            condition._public = true;
            condition._source = ['name', 'folderId', 'userId', 'preview', 'statics', 'time', 'firstImg'];
            if (checkAll) {
                delete condition.folderIds;
            }
            return EsNote.searchPage(condition, page);
        } else {
            let params = {
                inUse: true,
                private: false,
            };
            if (userId) {
                // 也可能搜指定人的（blog.html）
                // 也可能无限制 (index.html)
                params.userId = userId;
            }
            if (!checkAll && folderIds) {
                // 可能来自blog.html，有checkAll标识
                // 也可能来自index.html，无checkAll和folderIds
                params.folderId = {$in: folderIds}
            }
            return this.findWithPage(params, page, {'time.update': -1}, {md: 0});
        }
    }

    async createNote(user, folderId, body) {
        let {name, md} = await VS.NoteName.doValidate(body);
        md = md || '';
        name = await this.getUniqueName(user._id, folderId, name);
        let condition = {userId: user._id, folderId, name, inUse: true, private: true, md: `# ${name}\n` + md};
        // 设置一个更小的序列
        let minIndex = await this.find({folderId, inUse: true}, {index: 1}).limit(1);
        if (minIndex.length > 0) {
            condition.index = minIndex[0].index - 1;
        }
        let note = await this.save(condition);
        // note._doc才是真正的对象
        let {_id, ...other} = note._doc;
        await EsNote._create(_id, other);
        await Bus.emit('need-update-folder', {note});
        return note;
    }

    async getUniqueName(userId, folderId, noteName) {
        let count;
        let time = 0;
        let finalNoteName = noteName;
        do {
            count = await this.count({userId, folderId, name: finalNoteName});
            if (count > 0) {
                finalNoteName = noteName + '-' + (time++);
            } else {
                break;
            }
        } while (count > 0);
        return finalNoteName;
    }


    async deleteByFolderId(folderId) {
        let noteList = await this.find({folderId, inUse: true}, null, {_id: 1});
        for (let i = noteList.length - 1; i >= 0; i--) {
            await this.deleteNote(noteList[i]._id);
        }
    }

    /**
     * 逻辑删除笔记
     * */
    async deleteNote(noteId) {
        if (TimeLock.passLock('delete:' + noteId)) {
            let note = await this.findOne({_id: noteId, inUse: true}, false, {name: 1, userId: 1, private: 1});
            if (!note) {
                throw new Exception(CodeMsg.NotExists('笔记'));
            }
            let now = Date.now();
            if (!note.private) {
                // 原本公开的笔记，删除导致openNote -1
                await Bus.emit('openNote - n', {n: 1, userId: note.userId});
            }
            await EsNote._delete(noteId);
            return this.findByIdAndUpdate(noteId, {
                inUse: false,
                name: `(deleted-${now})${note.name}`,
                'time.remove': now
            }, {md: 0});
        }
    }

    /**
     * 物理删除过期14天的笔记
     * */
    clearExpire(days = 14) {
        return this.deleteMany({inUse: false, 'time.remove': {$gte: Date.now() - days * 24 * 60 * 60 * 1000}});
    }

    async increasePV(noteId) {
        let note = await this.findByIdAndUpdate(noteId, {$inc: {'statics.pv': 1}}, {fields: {md: 0, preview: 0}});
        await EsNote._updateDoc(note._id, {statics: note.statics});
        return note;
    }

    async increaseGreat(noteId) {
        let note = await this.findByIdAndUpdate(noteId, {$inc: {'statics.great': 1}}, {fields: {md: 0, preview: 0}});
        await EsNote._updateDoc(note._id, {statics: note.statics});
        return note;
    }

    async publish(user, body) {
        let {noteId} = await VS.PrivateNoteId.doValidate(body);
        if (TimeLock.passLock('publish:' + noteId)) {
            let update = {
                private: body.private,
                'time.update': Date.now()
            };
            let note = await this.findOneAndUpdate({_id: noteId, userId: user._id}, update, {
                fields: {
                    private: 1,
                    userId: 1,
                    folderId: 1
                }
            });
            if (note) {
                await EsNote._updateDoc(noteId, convertTimeUpdate(update));
                if (note.private) {
                    // 公开 -> 保密
                    await Bus.emit('openNote - n', {n: 1, userId: note.userId});
                } else {
                    // 保密 -> 公开
                    await Bus.emit('openNote + n', {n: 1, userId: note.userId});
                }
                await Bus.emit('need-update-folder', {note});
            }
            return note;
        }
    }


    async updateNoteName(noteId, body) {
        let {name} = await VS.NoteName.doValidate(body);
        let note = await this.findById(noteId);
        if (note) {
            if (note.name !== name) {
                let exists = await this.findOne({folderId: note.folderId, name: name});
                if (exists) {
                    throw new Exception(CodeMsg.AlreadyExists('笔记'));
                } else {
                    await Bus.emit('need-update-folder', {note});
                    let update = {name, 'time.update': Date.now()};
                    let rs = await this.updateNoteById(noteId, update);
                    // todo rs判断
                    await EsNote._updateDoc(noteId, convertTimeUpdate(update));
                    return rs;
                }
            } else {
                return note;
            }
        }
        throw new Exception(CodeMsg.NotExists('笔记'));
    }

    async updateNoteById(noteId, update) {
        update['time.update'] = Date.now();
        if (update.md) {
            let {text, firstImg} = HtmlUtil.markedCheerio(update.md);
            update.preview = text.substr(0, 386);
            update.firstImg = firstImg;
        }
        let note = await this.findByIdAndUpdate(noteId, update);
        await EsNote._updateDoc(noteId, convertTimeUpdate(update));
        await Bus.emit('need-update-folder', {note});
        return note;
    }

    async updateNoteIndex(userId, noteId, index, folderId) {
        let update = {index, folderId, 'time.update': Date.now()};
        let rs = await this.updateOne({_id: noteId, userId}, update, {fields: []});
        await EsNote._updateDoc(noteId, convertTimeUpdate(update));
        return rs;
    }

    async move(user, body) {
        let {noteId, oldFolderId, newFolderId} = await VS.NoteMove.doValidate(body);
        let update = {folderId: newFolderId, 'time.update': Date.now()};
        let rs = await this.updateOne({userId: user._id, _id: noteId, folderId: oldFolderId}, update);
        // todo rs 判断
        await EsNote._updateDoc(noteId, convertTimeUpdate(update));
        await Bus.emit('need-update-folder', {folderId: oldFolderId});
        await Bus.emit('need-update-folder', {folderId: newFolderId});
        return rs;
    }

    async getBlogNote(user, body) {
        let {noteId, token, md5} = body;
        if (md5) {
            let share = await Share.findOne({md5});
            if (share) {
                // 需要鉴权
                let {create, expireDays} = share.time;
                if (expireDays !== -1) {
                    let end = create + expireDays * 24 * 60 * 60 * 1000;
                    if (Date.now() > end) {
                        // 已过期，直接404
                        return {
                            access: false,
                            msg: '404'
                        }
                    }
                }
                // 未过期，检验token
                if (share.token !== token) {
                    // 认证不通过，需要再输入token
                    share.token = ''; //保留，前端用到
                    return {
                        access: true,
                        share
                    }
                }
                noteId = share.noteId;
            } else {
                return {
                    access: false,
                    msg: '404'
                }
            }
        }
        if (noteId) {
            let note = await this.findById(noteId, {preview: 0});
            if (!note) {
                return {
                    access: false,
                    msg: '404'
                }
            }
            if (!note.private || md5 || user && (note.userId === user._id)) {
                // 公开的 md5提取的 自己的
                return {
                    access: true,
                    note
                }
            } else {
                return {
                    access: false,
                    msg: '无权访问'
                }
            }
        } else {
            throw new Exception(CodeMsg.InvalidParams('缺少笔记id'));
        }
    }

    async getBlogNoteNeighbor(body) {
        let {folderId, index, noteId} = await VS.GetBlogNoteNeighbor.doValidate(body);
        // 下一篇
        // 0
        // 1
        // 2
        let nextNote = await this.findOne({
            folderId: folderId,
            _id: {$ne: noteId},
            private: false,
            inUse: true,
            index: {$gt: index}
        }, {index: 1}, {name: 1, userId: 1, folderId: 1});
        let preNote = await this.findOne({
            folderId: folderId,
            _id: {$ne: noteId},
            private: false,
            inUse: true,
            index: {$lt: index}
        }, {index: -1}, {name: 1, userId: 1, folderId: 1});
        return {
            nextNote,
            preNote
        }
    }
}

module.exports = new Note(schemaDefinition, Schema => {
    // Schema.virtual('isLocked').get(function () {
    //     return !!(this.lockUntil && this.lockUntil > Date.now());
    // });
    return {}
});

// searchPageOfOpen(condition = {}, page) {
//     condition.private = false;
//     condition.inUse = true;
//     let key = condition.key;
//     delete condition.key;
//     if (key && typeof key === 'string') {
//         key = key.trim();
//         if (key) {
//             condition.$or = [
//                 {name: {$regex: key}},
//                 {md: {$regex: md}}
//             ]
//         }
//     }
//     return this.findWithPage(condition, page, false, {md: 0});
// }
