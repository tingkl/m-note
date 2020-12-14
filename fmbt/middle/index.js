const RS = require('../rs');
const Exception = require('../exception');
const CodeMsg = require('../code-msg');
const filter = require('./filter');
const cp = require('child_process');
const util = require('util');
const exec = util.promisify(cp.exec);
module.exports = {
    async exception(ctx, next) {
        try {
            await next();
        } catch (e) {
            console.log('exception', e);
            if (e instanceof Exception) {
                // throw的或者reje8ct的都能捕捉到
                ctx.body = RS.fail(e.codeMsg);
            } else {
                ctx.body = RS.fail(CodeMsg.ServerError(e.toString()));
            }
        }
    },
    async gitPull(ctx, next) {
        if (/git\/pull/.test(ctx.request.url)) {
            let stdout = await exec('git pull', {
                maxBuffer: 1024 * 1024
            });
            ctx.body = stdout;
            next();
            cp.exec('pm2 restart xf', {
                maxBuffer: 1024 * 1024
            }, function (err, stdout, stderr) {
                console.log('pm2 restart', stdout);
            });
        } else {
            await next();
        }
    },
    filter
};
