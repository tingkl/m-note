const Koa = require('koa');
const app = new Koa();
const koaBody = require('koa-body');
const views = require('koa-views');
// const logger = require('koa-logger');
const session = require('koa-session');
const serve = require("koa-static");
const {resolve} = require('path');
const ejs = require('./routes/ejs');
const user = require('./routes/user');
const folder = require('./routes/folder');
const space = require('./routes/space');
const note = require('./routes/note');
const blog = require('./routes/blog');
const middle = require('./fmbt/middle');
const file = require('./fmbt/router/file');
const comment = require('./routes/comment');

const cf = require('./fmbt/cf');
const schedule = require('./service/schedule');
// 用于session加密
app.keys = [cf.key];

// app.use(logger());
app.use(session({
    key: cf.key,
    // 一个周过期
    maxAge: 1000 * 60 * 60 * 24 * 7
}, app));
app.use(views(resolve(__dirname, './views'), {
    extension: 'ejs'
}));
app.use(middle.exception);
app.use(middle.gitPull);
app.use(middle.filter);
app.use(koaBody({
    formLimit: '5mb',
    jsonLimit: '5mb',
    textLimit: '5mb',
    multipart: true,
    formidable: {
        uploadDir: cf.uploadDirPath,
        keepExtensions: true,
        maxFileSize: 20000 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
}));
app.use(blog.routes()).use(blog.allowedMethods());
app.use(user.routes()).use(user.allowedMethods());
app.use(folder.routes()).use(folder.allowedMethods());
app.use(note.routes()).use(note.allowedMethods());
app.use(space.routes()).use(space.allowedMethods());
app.use(file.routes()).use(file.allowedMethods());
app.use(comment.routes()).use(comment.allowedMethods());

app.use(serve(cf.publicDirPath, {
    gzip: true
    // setHeaders (res, filePath, stats) {
    //     res.setHeader('content-length', stats.blksize)
    // }
}));
app.use(ejs.routes()).use(ejs.allowedMethods());
app.listen(cf.port);
schedule();
