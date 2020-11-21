const Router = require('koa-router');
const RS = require('../fmbt/rs');
const Folder = require('../service/folder');
const Export = require('../service/export');
const Import = require('../service/import');
const router = new Router({
    prefix: '/folder'
});

router.put('/move', async function (ctx) {
    let user = ctx.session.user;
    let rs = await Folder.move(user, ctx.request.body);
    ctx.body = RS.success(rs);
});

router.post('/create', async function (ctx) {
    let user = ctx.session.user;
    let {name, spaceId} = ctx.request.body;
    let folder = await Folder.createFolder(user, spaceId, name);
    ctx.body = RS.success(folder);
});

router.get('/my/:spaceId', async function (ctx) {
    let spaceId = ctx.params.spaceId;
    if (spaceId === 'lastSpace') {
        spaceId = ctx.session.user.status.lastSpace._id;
    }
    const folders = await Folder.myOfSpace(spaceId);
    ctx.body = RS.success(folders);
});

router.post('/export/:folderId', async function (ctx) {
    let folderId = ctx.params.folderId;
    // let condition = ctx.request.body;
    let user = ctx.session.user;
    ctx.body = await Export.folder(user, folderId, ctx);
});

router.post('/import', async function (ctx) {
    let {spaceId, md5Ext} = ctx.request.body;
    let user = ctx.session.user;
    let log = await Import.folder(user, spaceId, md5Ext);
    ctx.body = RS.success(log);
});

router.del('/delete/:folderId', async function (ctx) {
    let folderId = ctx.params.folderId;
    let folder = await Folder.deleteFolder(folderId);
    ctx.body = RS.success(folder);
});

router.put('/updateName/:folderId', async function (ctx) {
   let folderId = ctx.params.folderId;
   let {name} = ctx.request.body;
   const folder = await Folder.updateFolderName(folderId, name);
   ctx.body = RS.success(folder);
});

// router.put('/publish', async function (ctx) {
//     let folderId = ctx.request.body.folderId;
//     let rs = await Folder.publish(ctx.session.user, folderId);
//     ctx.body = RS.success(rs);
// });

router.put('/updateNotesIndex', async function (ctx) {
    let pack = ctx.request.body;
    let user = ctx.session.user;
    let rs = await Folder.updateNotesIndex(user, pack);
    ctx.body = RS.success(rs);
});
module.exports = router;
