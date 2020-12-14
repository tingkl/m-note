const Router = require('koa-router');
const RS = require('../fmbt/rs');
const Space = require('../service/space');
const Import = require('../service/import');
const Export = require('../service/export');
const router = new Router({
    prefix: '/space'
});

router.post('/create', async function (ctx) {
    let user = ctx.session.user;
    let {name ,summary, type} = ctx.request.body;
    const space = await Space.createSpace(user, name, summary, type);
    ctx.body = RS.success(space);
});

router.get('/my', async function (ctx) {
    let user = ctx.session.user;
    let condition = ctx.request.query;
    const spaces = await Space.my(user, condition);
    ctx.body = RS.success(spaces);
});

router.get('/:spaceId', async function (ctx) {
   let spaceId = ctx.params.spaceId;
   const space = await Space.findById(spaceId);
   ctx.body = RS.success(space);
});

/**
 * 检索自己的笔记
 * 还要目录和空间信息
 * */
router.post('/my/searchNote', async function(ctx) {
    let user = ctx.session.user;
    let condition = ctx.request.body;
    const pack = await Space.searchMyNote(user, condition);
    ctx.body = RS.success(pack);
});

router.post('/export/:spaceId', async function (ctx) {
    let user = ctx.session.user;
    let spaceId = ctx.params.spaceId;
    // todo condition指定noteId
    // let condition = ctx.request.body;
    ctx.body = await Export.space(user, spaceId, ctx);
});

router.post('/import', async function (ctx) {
    let {md5Ext} = ctx.request.body;
    let user = ctx.session.user;
    let log = await Import.space(user, md5Ext);
    ctx.body = RS.success(log);
});

router.put('/updateName/:spaceId', async function (ctx) {
    let spaceId = ctx.params.spaceId;
    let {name} = ctx.request.body;
    const space = await Space.updateSpaceName(spaceId, name);
    ctx.body = RS.success(space);
});

router.del('/delete/:spaceId', async function (ctx) {
    let spaceId = ctx.params.spaceId;
    let user = ctx.session.user;
    let space = await Space.deleteSpace(user, spaceId);
    ctx.body = RS.success(space);
});
module.exports = router;
