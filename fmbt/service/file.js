/**
 * Created by tingkl on 2017/11/17.
 */
let Mongo = require('../db/mongo');
let fs = require('fs');
let path = require('path');
// let QS = require('../util/qiniu');
let dateFormat = require('dateformat');
let {compress} = require('../util/gm');
let MD5 = require('../util/md5');
const cf = require('../cf');
const sizeLimit = 1024 * 1024; // 图片大于1M时压缩
const maxWidth = 1242;

class File extends Mongo {
    async store(upload, gm = false, cdn = false) {
        let filePath = upload.path;
        let extension = path.extname(filePath);
        let dir = path.dirname(filePath);
        let gmLog = upload.size >= sizeLimit ? `需要压缩, ${upload.size}大于${sizeLimit};` : `无须压缩, ${upload.size}小于${sizeLimit};`;
        if (gm && upload.type.indexOf('image/') > -1 && gmLog.indexOf('需要压缩') > -1) {
            let {ok, size} = await compress(filePath, filePath, {docSize: upload.size, sizeLimit, maxWidth});
            if (ok) {
                let state = fs.statSync(filePath);
                gmLog += `压缩成功, ${state.size}, ${size.width}*${size.height}, ${dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')};`
            } else {
                gmLog += `压缩失败, ${dateFormat(new Date(), 'yyyy-mm-dd HH:MM:ss')};`
            }
        }
        let md5Ext = await MD5.fromFile(filePath) + extension;
        let doc = await this.findOne({md5Ext});
        let newPath = path.join(dir, md5Ext);
        let urlPath;
        if (!cdn) {
            urlPath = cf.serverUrlPath;
        } else {
            // todo上传cdn
        }
        if (!doc) {
            doc = await this.save({
                md5Ext: md5Ext,
                urlPath: urlPath,
                name: upload.name,
                type: upload.type,
                size: upload.size,
                gmLog
            });
        } else {
            doc = await this.findByIdAndUpdate(doc._id, {$inc: {count: 1}, gmLog});
        }
        if (fs.existsSync(newPath)) {
            fs.unlinkSync(upload.path);
        } else {
            fs.renameSync(upload.path, newPath);
        }
        return doc;
    }
}

module.exports = new File({
    md5Ext: {
        type: String,
        index: true
    },
    // 引用次数
    count: {
        type: Number,
        default: 1
    },
    name: String,
    type: String,
    size: Number,
    // 前缀地址
    urlPath: String,
    date: {
        type: String,
        default() {
            return dateFormat(new Date(), 'yyyy-mm-dd HH:MM')
        }
    },
    gmLog: {
        type: String,
        default: ''
    }
}, Schema => {
    return {};
});
