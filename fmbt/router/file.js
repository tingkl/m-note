const Router = require('koa-router');
const RS = require('../rs');
const FS = require('../service/file');
const FU = require('../util/file');
const {resizeCopy} = require('../util/gm')
const CF = require('../cf');
const MD5 = require('../util/md5');
const url = require('url');
const fs = require('fs');
const path = require('path');
const router = new Router({
    prefix: '/file'
});

router.post('/', async function (ctx) {
    let entity = await FS.store(ctx.request.files.file, true);
    ctx.body = RS.success(entity);
});

// 将外站图片保存为本站
router.post('/copy', async function (ctx) {
    let urlStr = ctx.request.body.url;
    if (urlStr) {
        const location = url.parse(urlStr);
        if (location.protocol === 'http:' || location.protocol === 'https:') {
            let user = ctx.session.user;
            let md5 = MD5.fromText(urlStr);
            let file = await FU.download(location.protocol, urlStr, CF.uploadDirPath, user._id + md5);
            let entity = await FS.store(file, true);
            ctx.body = {
                msg: '',
                code: 0,
                data: {
                    originalURL: urlStr,
                    url: '/file/' + entity.md5Ext
                }
            }
        } else {
            ctx.body = {
                msg: '',
                code: 0,
                data: {
                    originalURL: urlStr,
                    url: urlStr
                }
            }
        }
    } else {
        ctx.status = 201;
        ctx.body = '缺少url参数'
    }
});

router.post('/custom', async function (ctx) {
    let file = ctx.request.files.file;
    if (file instanceof Array) {

    } else {
        file = [file]
    }
    let succMap = {};
    let errFiles = [];
    for (let i = file.length - 1; i >= 0; i--) {
        let entity = await FS.store(file[i], true);
        succMap[entity.name] = '/file/' + entity.md5Ext
    }
    // let entity = await FS.store(ctx.request.files.file, true);
    // ctx.body = {
    //     success: 1,           // 0 表示上传失败，1 表示上传成功
    //     message: "上传成功",
    //     code: 0,
    //     type: entity.type,
    //     alt: entity.name,
    //     url:  '/file/' + entity.md5Ext        // 上传成功时才返回
    // }
    ctx.body = {
        msg: '',
        code: 0,
        data: {
            errFiles,
            succMap
        }
    }
});

router.get('/:md5Ext', async function (ctx) {
    let md5Ext = ctx.params.md5Ext;
    let query = ctx.request.query;
    let size = '';
    let w = parseInt(query.w);
    let h = parseInt(query.h);
    if (w > 0) {
        if (w > 1000) {
            w = 1000;
        } else if (w < 32) {
            w = 32;
        }
        size += 'w' + w;
    }
    if (h > 0) {
        if (h > 1000) {
            h = 1000;
        } else if (h < 32) {
            h = 32;
        }
        size += 'h' + h;
    }
    if (size) {
        let filePath = CF.getServerFilePath(md5Ext);
        let exist = fs.existsSync(filePath);
        if (exist) {
            let {ext, name} = path.parse(md5Ext);
            let md5SizeExt = name + size + ext;
            let targetPath = CF.getServerFilePath(md5SizeExt);
            if (!fs.existsSync(targetPath)) {
                await resizeCopy(filePath, targetPath, {w, h});
            }
            ctx.redirect('/upload/' + md5SizeExt);
        } else {
            ctx.status = 404;
        }
        // if (gmLock.passLock('resizeCopy', 1000, false)) {
        //
        // } else {
        //     // 防止调用过于频繁
        //     ctx.redirect('/upload/' + md5Ext);
        // }
    } else {
        ctx.redirect('/upload/' + md5Ext);
    }
    // let doc = await FS.findOne({md5Ext});
});

module.exports = router;
