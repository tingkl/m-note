const Router = require('koa-router');
const router = new Router({});
const {env, serverRoot} = require('../fmbt/cf');

router.get('/', async function (ctx) {
    let user = ctx.session.user || false;
    await ctx.render('index', {user});
});
router.get('/:ejs', async function (ctx, next) {
    const ejs = ctx.params.ejs.replace('.html', '');
    if (['main', 'search', 'note', 'blog', '404', 'markdown', 'index', 'other', 'message'].includes(ejs)) {
        let user = ctx.session.user || false;
        let requireUser = false;
        if (ejs === 'main') {
            requireUser = true;
        }
        if (requireUser && !user) {
            await ctx.redirect('index');
        } else {
            await ctx.render(ejs, {user});
        }
    } else {
        next();
    }
});

router.get('/s/:md5', async function (ctx) {
    await ctx.render('note');
});

let G = JSON.stringify({
    title: 'MNote',
    env,
    serverRoot,
    storageKey: 'm-note',
    dev: false,
    vConsole: env.profile !== 'prod',
    wx: {
        siteSignAPI: 'wx/js/signature',
        payAPI: 'wx/pay',
        pay1FenAPI: 'wx/pay/1fen',
        payCloseAPI: 'wx/pay/close'
    }
}, null, 4);

router.get('/g.js', async function (ctx) {
    let userAgent = ctx.request.headers['user-agent'];
    let inWx = (/MicroMessenger/i.test(userAgent));
    ctx.body =
        `var G = ${G};\n` +
        `G.inWx = ${inWx};\n` +
        `G.user = ${ctx.session.user ? JSON.stringify(ctx.session.user, null, 4) : false};\n` +
        `document.title = G.title;`;
});

module.exports = router;
