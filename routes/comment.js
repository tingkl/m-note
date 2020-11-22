const Router = require('koa-router');
const RS = require('../fmbt/rs');
const Comment = require('../service/comment');
const router = new Router({
    prefix: '/comment'
});

router.post('/post', async function (ctx) {
    let body = ctx.request.body;
    // index.html检索
    let data = await Comment.post(ctx.session.user._id, body);
    ctx.body = RS.success(data);
});

router.post('/searchPage', async function (ctx) {
    let {condition, page} = ctx.request.body;
    let data = await Comment.searchPage(condition, page);
    ctx.body = RS.success(data, page);
});

module.exports = router;
