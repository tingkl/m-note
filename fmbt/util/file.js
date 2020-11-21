const http = require('http');
const https = require('https');
const fs = require('fs');
const mime = require('mime');
const path = require('path');
module.exports = {
    download(_protocol, urlStr, savePath, prefix, optExtension = 'png') {
        let protocol;
        if (_protocol === 'http:') {
            protocol = http;
        } else if (_protocol === 'https:') {
            protocol = https;
        } else {
            throw 'http https only';
        }
        return new Promise(function (resolve, reject) {
            protocol.get(urlStr, function (res) {
                const contentType = res.headers['content-type'];
                let extension = mime.getExtension(contentType) || optExtension;
                // console.log('contentType', contentType, 'extension', extension);
                let chunkList = [];
                let size = 0;
                /**
                 * 设置了之后，chunk将会变成字符串
                 * typeof chunk string
                 * 后面存文件，还要再搞成buffer，所以这里就不设置编码了，不调用内部解析字符串
                 * typeof chunk object
                 **/
                // res.setEncoding('binary');
                res.on('data', function (chunk) {
                    console.log('typeof chunk', typeof chunk, chunk instanceof Buffer);
                    chunkList.push(chunk);
                    size += chunk.length;
                });

                res.on('end', function () {
                    let buf = Buffer.concat(chunkList, size);
                    let name = prefix + '.' + extension;
                    let filePath = path.join(savePath, name);
                    fs.writeFile(filePath, buf, 'binary', function (err) {
                        err ? reject(err) : resolve({path: filePath, size, type: contentType, name});
                    });
                });
                res.on('error', reject)
            });
        });
    }
};
