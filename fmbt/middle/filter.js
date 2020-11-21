const Util = require('../util');
const CodeMsg = require('../code-msg');
const Exception = require('../exception');
const URL = require('url');
const Method = {
    POST: 'POST',
    GET: 'GET',
    DELETE: 'DELETE',
    PUT: 'PUT',
    ALL: '*',
    OPTIONS: 'OPTIONS'
};

const authAPIs = [
    {method: Method.ALL, reg: /\/user\/signIn/},
    {method: Method.ALL, reg: /\/user\/signUp/},
    {method: Method.ALL, reg: /\/user\/signOut/},
    {method: Method.POST, reg: /\/user\/searchPage/},
    {method: Method.POST, reg: /\/note\/searchPage/},
    {method: Method.GET, reg: /\/note\/clear\/expire/},
    {method: Method.GET, reg: /\/user\/render/},
    {method: Method.ALL, reg: /\/blog\/savePage/, auth: {key: 'user'}},
    {method: Method.ALL, reg: /\/blog\/.*/},
    {method: Method.ALL, reg: /\/user\/.*/, auth: {key: 'user'}},
    {method: Method.ALL, reg: /\/folder\/.*/, auth: {key: 'user'}},
    {method: Method.ALL, reg: /\/space\/.*/, auth: {key: 'user'}},
    {method: Method.ALL, reg: /\/note\/.*/, auth: {key: 'user'}},
    {method: Method.POST, reg: /\/file\/.*/, auth: {key: 'user'}}
    // {method: Method.GET, reg: /\/note\/.*/, auth: {key: 'user', value: 'admin'}}
];
const crossAPIS = [
    /\/user\/login/,
    /\/pdf/
];
module.exports = async function (ctx, next) {
    let method = ctx.request.method;
    let url = ctx.request.url;
    let cross = false;
    Util.forEach(crossAPIS, reg => {
        if (reg.test(url)) {
            cross = true;
            return true;
        }
    });
    if (cross) {
        ctx.set("Access-Control-Allow-Credentials", "true");
        // OPTIONS是没有referer的，POST的时候有referer
        // origin是一直有的
        let origin = ctx.request.get('origin');
        if (!origin) {
            let loc = URL.parse(ctx.request.get('referer'));
            origin = loc.protocol + '//' + loc.host;
        }
        ctx.set("Access-Control-Allow-Origin", origin || '*');
        ctx.set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Authorization, Accept, X-Requested-With");
        ctx.set("Access-Control-Allow-Methods","PUT, POST, GET, DELETE, OPTIONS");
    }
    if (method === Method.OPTIONS) {
        if (cross) {
            ctx.status = 200;
        } else {
            ctx.status = 203;
        }
    } else {
        ctx.session.count = (ctx.session.count || 0) + 1;
        let hit = false;
        Util.forEach(authAPIs, match => {
            // console.log(match.reg.test(url), url);
            if ((match.method === Method.ALL || match.method === method) && match.reg.test(url)) {
                hit = match;
                // 停止循环
                return true;
            }
        });
        console.log('session 探活:', ctx.session.count, hit);
        if (hit) {
            let passOrNotNeedAuth = true;
            if (hit.auth) {
                passOrNotNeedAuth = false;
                let {key, val} = hit.auth;
                if (ctx.session.hasOwnProperty(key) && (!val || (val && ctx.session[key] === val))) {
                    passOrNotNeedAuth = true;
                }
            }
            if (passOrNotNeedAuth) {
                console.log('passOrNotNeedAuth', passOrNotNeedAuth, url);
                await next();
            } else {
                // 权限不足
                throw new Exception(CodeMsg.NotEnoughAuth);
            }
        } else {
            // 没有命中，不需要过滤
            await next();
        }
    }
};
