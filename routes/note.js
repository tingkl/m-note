const Router = require('koa-router');
const RS = require('../fmbt/rs');
const Note = require('../service/note');
const Export = require('../service/export');
const Import = require('../service/import');
const router = new Router({
    prefix: '/note'
});

router.post('/share', async function (ctx) {
    let user = ctx.session.user;
    let params = ctx.request.body;
   const share = await Note.share(user, params);
    ctx.body = RS.success(share);
});

router.post('/my/:folderId', async function (ctx) {
    let folderId = ctx.params.folderId;
    let {fields} = ctx.request.body;
    const notes = await Note.myOfFolder(folderId, fields);
    ctx.body = RS.success(notes);
});

router.post('/create/:folderId', async function (ctx) {
    let user = ctx.session.user;
    let folderId = ctx.params.folderId;
    await Note.createNote(user, folderId, ctx.request.body);
    ctx.body = RS.success();
});

router.put('/move', async function (ctx) {
    let user = ctx.session.user;
    let rs = await Note.move(user, ctx.request.body);
    ctx.body = RS.success(rs);
});

router.get('/load/:noteId', async function (ctx) {
    let noteId = ctx.params.noteId;
    let note = await Note.findById(noteId);
    ctx.body = RS.success(note);
});

router.post('/export/:noteId', async function (ctx) {
    let noteId = ctx.params.noteId;
    let user = ctx.session.user;
    ctx.body = await Export.note(user, noteId, ctx);
});

router.post('/import', async function (ctx) {
    let {folderId, md5Ext} = ctx.request.body;
    let user = ctx.session.user;
    let log = await Import.note(user, folderId, md5Ext);
    ctx.body = RS.success(log);
});

router.del('/delete/:noteId', async function (ctx) {
    let noteId = ctx.params.noteId;
    let note = await Note.deleteNote(noteId);
    ctx.body = RS.success(note);
});

// router.get('/clear/expire', async function (ctx) {
//     let rs = await Note.clearExpire14Days();
//     ctx.body = RS.success(rs);
// });

router.put('/update/:noteId', async function (ctx) {
    let noteId = ctx.params.noteId;
    let update = ctx.request.body;
    let note = await Note.updateNoteById(noteId, update);
    ctx.body = RS.success(note);
});

router.put('/updateName/:id', async function (ctx) {
    let  noteId = ctx.params.id;
    const note = await Note.updateNoteName(noteId, ctx.request.body);
    ctx.body = RS.success(note);
});

router.put('/publish', async function (ctx) {
    let rs = await Note.publish(ctx.session.user, ctx.request.body);
    ctx.body = RS.success(rs);
});

module.exports = router;
