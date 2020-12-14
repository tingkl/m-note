const CodeMsg = require('../code-msg');
const Exception = require('../exception');
const Redis = require('../db/redis')
class TimeLock {
    constructor(key) {
        this.key = key;
        this.store = {};
    }
    passLock(id, duration = 3000, throwException = '为啥会如此频繁调用同一个接口，真的需要吗？') {
        if (!this.store.hasOwnProperty(id)) {
            this.store[id] = 0;
        }
        let now = Date.now();
        if (now > this.store[id] + duration) {
            this.store[id] = now;
            return true;
        }
        if (throwException) {
            throw new Exception(CodeMsg.TimeLock(throwException));
        }
        return false;
    }

    async atom (key, ctx, expireSecond = 60) {
        if (Array.isArray(key)) {
            key = key.join('.');
        }
        key += '-' + this.key
        let delCb = await Redis.lock(key, expireSecond)
        if (delCb) {
            ctx && (ctx.delCb = delCb)
            return delCb
        } else {
            throw new Exception(CodeMsg.TimeLock('请慢一点'));
        }
    }
}

let map = {};
module.exports = function (key) {
    if (!map.hasOwnProperty(key)) {
        map[key] = new TimeLock(key);
    }
    return map[key];
};
