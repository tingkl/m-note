const Router = require('koa-router');
const RS = require('../fmbt/rs');
const User = require('../service/user');
const router = new Router({
    prefix: '/user'
});

router.post('/searchPage', async function (ctx) {
    let {page} = ctx.request.body;
    // index.html检索
    let users = await User.searchPageOfOpen(page);
    ctx.body = RS.success(users, page);
});

router.get('/render/:id', async function (ctx) {
    let user = await User.findById(ctx.params.id, {'account.name': 1, 'account.photo': 1});
    ctx.body = RS.success(user);
});


router.get('/sync', async function (ctx) {
    ctx.body = RS.success(ctx.session.user);
});

router.put('/update/account', async function (ctx) {
    let user = ctx.session.user;
    user = await User.updateAccount(user, ctx.request.body);
    ctx.session.user = user;
    ctx.body = RS.success(user);
});

router.put('/update/previewColor', async function (ctx) {
    let user = ctx.session.user;
    user = await User.updatePreviewColor(user, ctx.request.body);
    ctx.session.user = user;
    ctx.body = RS.success(user);
});

router.put('/update/theme', async function (ctx) {
    let user = ctx.session.user;
    user = await User.updateTheme(user, ctx.request.body);
    ctx.session.user = user;
    ctx.body = RS.success(user.preview.theme.current);
});

router.put('/update/style', async function (ctx) {
    let user = ctx.session.user;
    user = await User.updateStyle(user, ctx.request.body);
    ctx.session.user = user;
    ctx.body = RS.success(user.preview.hljs.style);
});

router.post('/signUp', async function (ctx) {
    const account = ctx.request.body;
    let user = await User.signUpByAccount(account);
    ctx.body = RS.success(user);
});

router.post('/signIn', async function (ctx) {
    const account = ctx.request.body;
    let user = await User.signInByAccount(account);
    ctx.session.user = user;
    ctx.body = RS.success(user);
});

router.post('/signOut', async function (ctx) {
    delete ctx.session.user;
    ctx.body = RS.success();
});


module.exports = router;
