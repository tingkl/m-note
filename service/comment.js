const Tag = 'comment';
const Mongo = require('../fmbt/db/mongo');
const CodeMsg = require('../fmbt/code-msg');
const Exception = require('../fmbt/exception');
const User = require('./user');
const VS = require('../fmbt/validator')(Tag);
const schemaDefinition = {
    kind: {
        type: String,
        enum: ['note', 'message-page', 'comment']
    },
    targetId: { // noteId userId commentId
        type: String,
        index: true,
        required: true
    },
    rootId: {
        index: true,
        type: String,
        required: true
    },
    parentId: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        enum: [1, 2, 3, 4, 5, 6]
    },
    // 发布者id
    userId: {
        type: String,
        index: true,
        required: true
    },
    html: {
        type: String,
        required: true
    },
    createTime: {
        type: Number,
        default() {
            return Date.now()
        }
    }
};
VS.CommentSearchPage = {
    targetId: {
        required: true
    },
    kind: {
        required: true
    }
};

class Comment extends Mongo {
    post(userId, {level, targetId, kind, rootId, parentId, html}) {
        if (level === 1) {
            rootId = 'myself';
            parentId = targetId;
        }
        // level1是没有rootId和parentId的，因为rootId就为自己，parentId就是targetId
        return this.save({level, targetId, kind, rootId, parentId, userId, html});
    }
    async searchPage(condition, page) {
        let {targetId, kind} = await VS.CommentSearchPage.doValidate(condition);
        let commentList1 = await this.findWithPage({targetId, kind, level: 1}, page, {'createTime': -1});
        let rootIds = []
        let userIds = new Set();
        commentList1.forEach(comment => {
            rootIds.push(comment._id);
            userIds.add(comment.userId);
        });
        // 找到所有rootId为level1的
        let commentListOther = await this.find({rootId: {$in: rootIds}}, {level: 1, 'createTime': 1});
        commentListOther.forEach(comment => {
            userIds.add(comment.userId);
        });
        let userList = await User.find({_id: {$in: Array.from(userIds)}}, false, {'account.name': 1, 'account.photo': 1});

        let count = await this.count({targetId, kind});
        return {
            count,
            userList,
            commentList1,
            commentListOther
        }
    }

}

const service = new Comment(schemaDefinition, Schema => {
    return {
        'account.password': 0
    }
});


module.exports = service;
