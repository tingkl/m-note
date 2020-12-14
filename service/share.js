const Mongo = require('../fmbt/db/mongo');
const Util = require('../fmbt/util/index');
const MD5 = require('../fmbt/util/md5');
const schemaDefinition = {
    md5: {
        type: String,
        index: true,
        required: true
    },
    noteId: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    time: {
        create: {
            type: Number,
            default() {
                return Date.now()
            }
        },
        expireDays: {
            type: Number,
            default: -1  // -1表示永不过期
        }
    }
};

class Share extends Mongo {
    createLink(userId, noteId, expireDays) {
        let entity = {
            token: Util.randomCode(4),
            userId,
            noteId,
            time: {
                create: Date.now(),
                expireDays
            }
        };
        entity.md5 = MD5.fromText(JSON.stringify(entity));
        return this.save(entity);
    }
}

const service = new Share(schemaDefinition, Schema => {
    // Schema.virtual('isLocked').get(function () {
    //     return !!(this.lockUntil && this.lockUntil > Date.now());
    // });
    return {}
});

module.exports = service;
