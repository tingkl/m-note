const Mongo = require('../fmbt/db/mongo');
const CodeMsg = require('../fmbt/code-msg');
const Note = require('./note');
const Folder = require('./folder');
const Exception = require('../fmbt/exception');
// const Note = require('./note');
const Bus = require('../fmbt/bus');
const TimeLock = require('../fmbt/util/timelock');
const Redis = require('../fmbt/db/redis');
let deleteLock = TimeLock.get('space-delete');
const schemaDefinition = {
    // 空间名小于10
    // space可以重名
    name: {
        type: String,
        required: true
    },
    // 描述
    summary: {
        type: String,
        default: ''
    },
    type: {
        type: String,
        default: 'personal',
        enum: ['personal', 'team']
    },
    // 所有者id
    userId: {
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
    patch: {
        type: Object
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

class Space extends Mongo {
    async createFirstSpace(user) {
        let condition = {'userId': user._id};
        let space = await this.findOne(condition);
        if (!space) {
            condition.name = 'My First Space';
            return await this.save(condition);
        }
    }

    async createSpace(user, name, summary = '', type = 'personal') {
        name = await this.getUniqueName(user._id, name);
        let condition = {'userId': user._id, name, summary, type};
        return this.save(condition);
    }

    async getUniqueName(userId, spaceName) {
        let count;
        let time = 0;
        let finalSpaceName = spaceName;
        do {
            count = await this.count({userId, name: finalSpaceName, inUse: true});
            if (count > 0) {
                finalSpaceName = spaceName + '-' + (time++);
            } else {
                break;
            }
        } while (count > 0);
        return finalSpaceName;
    }

    // async searchMyNote(my, condition) {
    //     let notes;
    //     let folders;
    //     if (condition.type === '笔记') {
    //         notes = await Note.mySearch(my, condition, {name: 1, folderId: 1, private: 1});
    //         let folderIds = [];
    //         notes.forEach(note => {
    //             if (!folderIds.includes(note.folderId)) {
    //                 folderIds.push(note.folderId);
    //             }
    //         });
    //         folders = await Folder.find({_id: {$in: folderIds}}, null, {spaceId: 1, name: 1});
    //     } else {
    //         // 目录检索
    //         folders = await Folder.mySearch(my, {
    //             name: {
    //                 $regex: condition.key,
    //                 $options: 'is'
    //             },
    //             inUse: true
    //         }, null, {spaceId:  1, name: 1});
    //         // 通过目录找笔记
    //         notes = await Note.mySearch(my, {
    //             folderId: {
    //                 $in: folders.map(folder => folder._id.toString())
    //             },
    //             inUse: true
    //         });
    //     }
    //     let spaceIds = [];
    //     folders.forEach(folder => {
    //         if (!spaceIds.includes(folder.spaceId)) {
    //             spaceIds.push(folder.spaceId);
    //         }
    //     });
    //     let spaces = await this.find({_id: {$in: spaceIds}}, null, {name: 1});
    //     return {notes, folders, spaces};
    // }

    async searchMyNote(my, {type, key}) {
        let notes;
        let folders;
        let condition = {
            key,
            inUse: true
        };
        // 1. 没有key，则从mongodb中查询所有
        // 2. 有key，则从es中查询md后者name或者folderId
        if (type === '目录' && key) {
            folders = await Folder.mySearch(my, {
                name: {
                    $regex: key,
                    $options: 'is'
                },
                inUse: true
            }, null, {_id: 1});
            condition.folderIds = folders.map(folder => folder._id.toString());
        }
        notes = await Note.mySearch(my, condition, {name: 1, folderId: 1, private: 1});
        let folderIds = [];
        notes.forEach(note => {
            if (!folderIds.includes(note.folderId)) {
                folderIds.push(note.folderId);
            }
        });
        folders = await Folder.find({_id: {$in: folderIds}}, null, {spaceId: 1, name: 1});
        let spaceIds = [];
        folders.forEach(folder => {
            if (!spaceIds.includes(folder.spaceId)) {
                spaceIds.push(folder.spaceId);
            }
        });
        let spaces = await this.find({_id: {$in: spaceIds}}, null, {name: 1});
        return {notes, folders, spaces};
    }


    async deleteSpace(user, spaceId) {
        if (deleteLock.passLock(spaceId)) {
            if (user.status.lastSpace._id === spaceId) {
                throw new Exception(CodeMsg.CannotDeleteLastSpace);
            } else {
                let space = await this.findOne({_id: spaceId, inUse: true, userId: user._id});
                if (!space) {
                    throw new Exception(CodeMsg.SpaceNotExists);
                }
                let now = Date.now();
                space = await this.findByIdAndUpdate(spaceId, {
                    inUse: false,
                    name: `(deleted-${now})${space.name}`,
                    'time.remove': now
                });
                await Folder.deleteBySpaceId(spaceId);
                return space;
            }
        }
    }

    /**
     * 物理删除过期14天的空间
     * */
    clearExpire (days = 14) {
        return this.deleteMany({inUse: false, 'time.remove':  {$gte: Date.now() - days * 24 * 60 * 60 * 1000}});
    }

    updateSpaceById(spaceId, update) {
        update['time.update'] = Date.now();
        return this.findByIdAndUpdate(spaceId, update);
    }

    async updateSpaceName(spaceId, name) {
        let space = await this.findById(spaceId);
        if (space) {
            if (space.name !== name) {
                return this.updateSpaceById(spaceId, {name});
            } else {
                return space;
            }
        }
        throw new Exception(CodeMsg.FolderNotExists);
    }

    // my的是自己用的，限定user
    my(my, condition = {}) {
        return this.find({...condition, userId: my._id, inUse: true}, {'time.update': -1});
    }

    async searchPublicByUserId(userId) {
        let folders = await Folder.searchPublicByUserId(userId);
        let spaceIds = folders.map(folder => folder.spaceId);
        let spaces = await this.find({_id: {$in: spaceIds}, inUse: true}, {'time.update': -1}, {name: 1});
        return {spaces, folders};
    }
}

const service = new Space(schemaDefinition, Schema => {
    // Schema.virtual('isLocked').get(function () {
    //     return !!(this.lockUntil && this.lockUntil > Date.now());
    // });
    return {}
});

Bus.once('need-update-space', async ({folder}) => {
    let spaceId = folder.spaceId;
    if (spaceId) {
        let key = 'need-update-space-' + spaceId;
        let throttle = await Redis.get(key);
        if (!throttle) {
            await Redis.set(key, Date.now(), 10);
            return service.findByIdAndUpdate(spaceId, {'time.update': Date.now()});
        }
    } else {
        console.error('need-update-space', 'no spaceId');
    }
});
module.exports = service;
