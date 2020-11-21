let async = require('async');
let gm = require('gm');
let imageMagick = gm.subClass({imageMagick: true});
// compress('/Users/awesome/Desktop/素材/WechatIMG14.jpeg', './test.jpeg', {docSize: 2.4, sizeLimit: 1, maxWidth: 2016});
module.exports = {
    resizeCopy(filePath, targetPath, {w, h}) {
        return new Promise(function(resolve, reject) {
            let op = imageMagick(filePath);
            op.resize(w, h).write(targetPath, function (err) {
                err ? reject(err) : resolve();
            })
        });
    },
    compress(filePath, targetPath, {docSize, sizeLimit, maxWidth}) {
        return new Promise(function (resolve, reject) {
            console.time('gm ' + filePath);
            let op = imageMagick(filePath);
            let size;
            async.waterfall([
                cb => {
                    op.size(cb);
                },
                (_size, cb) => {
                    size = _size;
                    let quality = sizeLimit * 100 / docSize;
                    if (size.width > maxWidth) {
                        console.log('resize:', size.width + '=>' + maxWidth);
                        op = op.resize(maxWidth);
                        let scale = size.width / maxWidth;
                        console.log('quality', quality.toFixed(0));
                        quality = quality * scale;
                        console.log('scale to', scale, quality.toFixed(0));
                    }
                    quality = Math.max(Math.floor(quality), 25);
                    if (quality < 100) {
                        console.log('quality:', quality);
                        op = op.quality(quality);
                    }
                    op.write(targetPath, cb);
                }
            ], err => {
                if (err) {
                    console.error(err);
                    // 压缩不了，就不压缩了
                    resolve({ok: false, size});
                } else {
                    resolve({ok: true, size});
                }
                console.timeEnd('gm ' + filePath);
            });
        });
    }
};
