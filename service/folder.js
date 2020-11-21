const Mongo = require('../fmbt/db/mongo');
const CodeMsg = require('../fmbt/code-msg');
const Exception = require('../fmbt/exception');
const Bus = require('../fmbt/bus');
const TimeLock = require('../fmbt/util/timelock');
const Redis = require('../fmbt/db/redis');
// let publishLock = TimeLock.get('folder-publish');
let deleteLock = TimeLock.get('folder-delete');
const Note = require('./note');
const schemaDefinition = {
    // 文件夹名
    name: {
        type: String,
        required: true
    },
    // 描述
    summary: {
        type: String,
        default: ''
    },
    // 所有者id
    userId: {
        index: true,
        type: String,
        required: true
    },
    // 所属的空间id
    spaceId: {
        index: true,
        type: String,
        required: true
    },
    inUse: {
        index: true,
        type: Boolean,
        required: true,
        default: true
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

class Folder extends Mongo {
    async move(user, {folderId, oldSpaceId, newSpaceId}) {
        if (!folderId || !oldSpaceId || !newSpaceId) {
            throw new Exception(CodeMsg.InvalidParams('folderId, oldSpaceId, newSpaceId is required!'));
        }
        await this.updateOne({userId: user._id, _id: folderId, spaceId: oldSpaceId}, {
            spaceId: newSpaceId,
            'time.update': Date.now()
        })
        return Bus.emit('need-update-space', {folder: {spaceId: newSpaceId}});
    }

    async createFolder(user, spaceId, name, summary = '') {
        name = await this.getUniqueName(user._id, spaceId, name);
        let condition = {userId: user._id, spaceId, name, summary};
        let rs = await this.save(condition);
        await Bus.emit('need-update-space', {folder: {spaceId}});
        return rs;
    }

    async deleteFolder(folderId) {
        if (deleteLock.passLock(folderId)) {
            let folder = await this.findOne({_id: folderId, inUse: true});
            if (!folder) {
                throw new Exception(CodeMsg.FolderNotExists);
            }
            let now = Date.now();
            folder = await this.findByIdAndUpdate(folderId, {
                inUse: false,
                name: `(deleted-${now})${folder.name}`,
                'time.remove': now
            });
            await Note.deleteByFolderId(folderId);
            return folder;
        }
    }

    /**
     * 物理删除过期14天的目录
     * */
    clearExpire (days = 14) {
        return this.deleteMany({inUse: false, 'time.remove':  {$gte: Date.now() - days * 24 * 60 * 60 * 1000}});
    }

    async deleteBySpaceId(spaceId) {
        let folderList = await this.find({spaceId, inUse: true}, null, {folderId: 1});
        for (let i = folderList.length - 1; i >= 0; i--) {
            await this.deleteFolder(folderList[i]._id);
        }
    }

    async getUniqueName(userId, spaceId, folderName) {
        let count;
        let time = 0;
        let finalFolderName = folderName;
        do {
            count = await this.count({userId, spaceId, name: finalFolderName});
            if (count > 0) {
                finalFolderName = folderName + '-' + (time++);
            } else {
                break;
            }
        } while (count > 0);
        return finalFolderName;
    }

    async updateFolderName(folderId, name) {
        let folder = await this.findById(folderId);
        if (folder) {
            if (folder.name !== name) {
                let exists = await this.findOne({spaceId: folder.spaceId, name: name});
                if (exists) {
                    throw new Exception(CodeMsg.FolderAlreadyExists);
                } else {
                    return this.updateFolderById(folderId, {name});
                }
            } else {
                return folder;
            }
        }
        throw new Exception(CodeMsg.FolderNotExists);
    }

    updateFolderById(folderId, update) {
        update['time.update'] = Date.now();
        return this.findByIdAndUpdate(folderId, update);
    }

    findByIds(ids) {
        return this.find({_id: {$in: ids}, inUse: true});
    }

    myOfSpace(spaceId) {
        return this.find({spaceId, inUse: true}, {'time.update': -1});
    }

    async searchPublicByUserId(userId) {
        let folderIds = await Note.distinct('folderId', {userId, inUse: true, private: false});
        return this.find({_id: {$in: folderIds}, inUse: true}, {'time.update': -1}, {name: 1, spaceId: 1});
    }

    async updateNotesIndex(user, {folderId, updateList}) {
        let userId = user._id;
        let folder = await this.findById(folderId);
        let rs = [];
        if (userId === folder.userId) {
            for (let i = updateList.length - 1; i >= 0; i--) {
                let {noteId, index} = updateList[i];
                let raw = await Note.updateNoteIndex(userId, noteId, index, folderId);
                rs.push(raw);
            }
            await Bus.emit('need-update-folder', {folderId});
            return rs;
        } else {
            throw new Exception(CodeMsg.Custom('只能操作自己的目录'));
        }
    }

    // async publish(user, folderId) {
    //     if (publishLock.passLock(folderId)) {
    //         let folder = await this.findById(folderId);
    //         if (folder && folder.userId === user._id) {
    //             await Bus.emit('need-update-folder', {folderId});
    //             let rs = await Note.publishByFolder(folderId);
    //             await Bus.emit('openNote + n', {n: rs.nModified, userId: user._id});
    //         } else {
    //             throw new Exception(CodeMsg.FolderNotExists);
    //         }
    //     }
    // }

    listFolderOfUser(user, condition = {}) {
        return this.find({...condition, userId: user._id, inUse: true}, {'time.update': -1});
    }

    mySearch(my, condition, sort, fields) {
        condition.userId = my._id;
        return this.find(condition, sort, fields);
    }
}

const service = new Folder(schemaDefinition, Schema => {
    // Schema.virtual('isLocked').get(function () {
    //     return !!(this.lockUntil && this.lockUntil > Date.now());
    // });
    return {
        'inUse': 0
    }
});

Bus.once('need-update-folder', async ({folderId, note}) => {
    folderId = folderId || note.folderId;
    if (folderId) {
        let key = 'need-update-folder-' + folderId;
        let throttle = await Redis.get(key);
        if (!throttle) {
            // 秒
            await Redis.set(key, Date.now(), 10);
            let folder = await service.findByIdAndUpdate(folderId, {'time.update': Date.now()});
            if (folder) {
                await Bus.emit('need-update-space', {folder});
            }
            return folder;
        }
    } else {
        console.error('need-update-folder', 'no folderId');
    }
});
module.exports = service;
