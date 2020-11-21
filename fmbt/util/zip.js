const archiver = require('archiver');
// const PassThrough = require('stream').PassThrough;

class Zip {
    constructor() {
        let archive = archiver('zip', {
            zlib: {level: 9} // Sets the compression level.
        });

        archive.on('warning', function (err) {
            if (err.code === 'ENOENT') {
                // log warning
            } else {
                // throw error
                throw err;
            }
        });

        archive.on('error', function (err) {
            throw err;
        });

        this.archive = archive;
    }

    appendFile(name, content) {
        this.archive.append(content, {name});
    }

    /**
     * 以上在 Koa 中直接创建一个可读流赋值给 ctx.body 就可以了，你可能疑惑了为什么没有 pipe 方法，因为框架给你封装好了，不要被表象所迷惑了，看下相关源码：
     // https://github.com/koajs/koa/blob/master/lib/application.js#L256
     function respond(ctx) {
          ...
          let body = ctx.body;
          if (body instanceof Stream) return body.pipe(res);
          ...
        }
     *
     * */
    // pipeCtx(ctx) {
    //     ctx.body = this.archive.on('error', ctx.onerror).on('end', () => {
    //         console.log('archive.end', this.archive.pointer(), bufferStream)
    //         ctx.set('content-length', this.archive.pointer());
    //     })
    //     this.archive.finalize();
    // }

    // pipeCtx(ctx) {
    //     let chunks = [];
    //     let size = 0;
    //     // end(可读流触发) 当流中没有数据可供消费时触发。
    //     this.archive.on('error', ctx.onerror).on('data', function (chunk) {
    //         chunks.push(chunk);
    //         size += chunk.length;
    //     }).on('end', () => {
    //         let buffer = Buffer.concat(chunks, size);
    //         let length = this.archive.pointer();
    //         console.log('archive.end', buffer.length, length);
    //         ctx.set('content-length', length);
    //         ctx.set('content-type', 'application/zip; charset=utf-8');
    //         // 创建一个bufferStream
    //         let bufferStream = new PassThrough();
    //         // 将Buffer写入
    //         bufferStream.end(buffer);
    //         ctx.body = bufferStream;
    //     });
    //     this.archive.finalize();
    // }

    getBuffer () {
        return new Promise((resolve, reject) => {
            let chunks = [];
            let size = 0;
            // end(可读流触发) 当流中没有数据可供消费时触发。
            this.archive.on('error', reject).on('data', function (chunk) {
                chunks.push(chunk);
                size += chunk.length;
            }).on('end', () => {
                let buffer = Buffer.concat(chunks, size);
                console.log('archive.end', buffer.length, this.archive.pointer());
                resolve(buffer);
            });
            this.archive.finalize();
        })
    }
}

module.exports = Zip;
