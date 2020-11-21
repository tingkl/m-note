const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
let privateKey;
let me = {
    _dict: [],
    getDict() {
        if (this._dict.length <= 0) {
            for (let a = 'a'.charCodeAt(0), z = 'z'.charCodeAt(0); a <= z; a++) {
                this._dict.push(String.fromCharCode(a));
            }
            for (let a = 'A'.charCodeAt(0), z = 'Z'.charCodeAt(0); a <= z; a++) {
                this._dict.push(String.fromCharCode(a));
            }
            for (let i = 0; i < 10; i++) {
                this._dict.push(i);
            }
        }
        return this._dict;
    },
    randomCode(size) {
        let dict = this.getDict();
        let code = [];
        for (let i = 0; i < size; i++) {
            code.push(dict[Math.floor(Math.random() * dict.length)]);
        }
        return code.join('');
    },
    forEach(array, handler) {
        let item;
        let length = array.length;
        for (let i = 0; i < length; i++) {
            item = array[i];
            if (handler(item) === true) {
                break;
            }
        }
    },
    getIp(ctx) {
        let header = ctx.request.header;
        let ip = header['x-real-ip'] || header['x-forwarded-for'] || ctx.request.ip;
        if (ip.indexOf('::') > -1) {
            ip = '220.248.44.114';
        }
        return ip;
    },
    textBody(ctx) {
        return new Promise((resolve, reject) => {
            let chunks = [];
            let size = 0;
            ctx.req.on('data', chunk => {
                chunks.push(chunk);
                size += chunk.length;
            });
            ctx.req.on('end', () => {
                let buf = Buffer.concat(chunks, size);
                resolve(buf.toString());
            });
            ctx.req.on('error', reject);
        });
    },
    rsaDecrypt(text) {
        if (!privateKey) {
            privateKey = fs.readFileSync(path.join(__dirname, 'openssl', 'private.pem'));
        }
        let textBuffer, decryptText;
        try {
            textBuffer = new Buffer(text, "base64"); // jsencrypt 库在加密后使用了base64编码,所以这里要先将base64编码后的密文转成buffer
            decryptText = crypto.privateDecrypt({
                key: privateKey, // 如果通过文件方式读入就不必转成Buffer
                padding: crypto.constants.RSA_PKCS1_PADDING // 因为前端加密库使用的RSA_PKCS1_PADDING标准填充,所以这里也要使用RSA_PKCS1_PADDING
            }, textBuffer).toString();
        } catch (err) {
            throw err;
        }
        return decryptText;
    }
};
module.exports = me;
