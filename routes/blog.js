const Router = require('koa-router');
const RS = require('../fmbt/rs');
const Space = require('../service/space');
const Folder = require('../service/folder');
const Note = require('../service/note');
const User = require('../service/user');
const Exception = require('../fmbt/exception');
const CodeMsg = require('../fmbt/code-msg');

const router = new Router({
    prefix: '/blog'
});

// todo 历史方式
// router.post('/notes', async function (ctx) {
//     let body = ctx.request.body;
//     // 按照笔记更新时间
//     let notes = await Note.pageBlogNote(body.userId, body.page);
//     let folderIds = [];
//     notes.forEach(note => {
//         if (!folderIds.includes(note.folderId)) {
//             folderIds.push(note.folderId);
//         }
//     });
//     let folders = await Folder.findByIds(folderIds);
//     ctx.body = RS.success({folders, notes}, body.page);
// });
router.post('/spaces', async function (ctx) {
    let {userId} = ctx.request.body;
    const pack = await Space.searchPublicByUserId(userId);
    ctx.body = RS.success(pack);
});

router.post('/notes', async function (ctx) {
    let {condition, page} = ctx.request.body;
    condition.fromBlog = true;
    let notes = await Note.searchPage(condition, page);
    ctx.body = RS.success(notes, page);
});

router.get('/sort/:userId', async function (ctx) {
    let userId = ctx.params.userId;
    let notes = await Note.find({userId, inUse: true, private: false}, false, {name: 1, time: 1});
    let user = await User.basic(userId);
    ctx.body = RS.success({notes, user});
});

router.post('/folders', async function (ctx) {
    let {userId} = ctx.request.body;
    let condition = {
        inUse: true,
        userId,
        private: false
    };
    let folderIds = await Note.distinct('folderId', condition);
    let folders = await Folder.find({
        _id: {$in: folderIds},
        inUse: true
    }, {'time.update': -1}, {name: 1, _id: 1, userId: 1, time: 1});
    ctx.body = RS.success(folders);
});

router.put('/pv', async function (ctx) {
    let noteId = ctx.request.body.noteId;
    let note = await Note.increasePV(noteId);
    ctx.body = RS.success(note);
});

router.put('/great', async function (ctx) {
    let noteId = ctx.request.body.noteId;
    let note = await Note.increaseGreat(noteId);
    ctx.body = RS.success(note);
});

router.get('/user/:userId', async function (ctx) {
    let userId = ctx.params.userId;
    try {
        let user = await User.basic(userId);
        ctx.body = RS.success(user);
    } catch (e) {
        ctx.body = RS.tip(e.toString());
    }
});

router.post('/getNote', async function (ctx) {
    let user = ctx.session.user;
    let body = ctx.request.body;
    let {access, note, msg, share} = await Note.getBlogNote(user, body);
    if (access) {
        let folder;
        let noteUser;
        if (note) {
            folder = await Folder.findById(note.folderId, {name: 1, userId: 1});
            noteUser = await User.basic(note.userId);
        } else if (share) {
            noteUser = await User.basic(share.userId);
        }
        ctx.body = RS.success({access, note, folder, user: noteUser, share});
    } else {
        ctx.body = RS.success({access, msg});
    }
});

router.post('/getUser', async function (ctx) {
    let {userId, key} = ctx.request.body;
    let myId = ctx.session.user ? ctx.session.user._id.toString() : '';
    let fields = {'account.name': 1, 'account.photo': 1, 'account.desc': 1,  'account.word': 1,  preview: 1};
    if (['contact', 'link'].includes(key)) {
       fields['page.' + key] = 1;
    }
    let user = await User.findById(userId, fields);
    ctx.body = RS.success({user, myself: user._id.toString() === myId});
});

router.post('/savePage', async function (ctx) {
    let {userId, key, md} = ctx.request.body;
    if (['contact', 'link'].includes(key)) {
        let rs = await User.updateOne({_id: userId}, {['page.' + key]: md});
        ctx.body = RS.success(rs);
    } else {
        throw new Exception(CodeMsg.InvalidParams('contact|link'));
    }
});

router.post('/getNoteNeighbor', async function (ctx) {
    let body = ctx.request.body;
    let data = await Note.getBlogNoteNeighbor(body);
    ctx.body = RS.success(data);
});
module.exports = router;
