const CodeMsg = require('../code-msg');
const Exception = require('../exception');
class TimeLock {
    constructor(key) {
        this.key = key;
        this.store = {};
    }
    passLock(id, duration = 3000, throwException = true) {
        if (!this.store.hasOwnProperty(id)) {
            this.store[id] = 0;
        }
        let now = Date.now();
        if (now > this.store[id] + duration) {
            this.store[id] = now;
            return true;
        }
        if (throwException) {
            throw new Exception(CodeMsg.TimeLock);
        }
        return false;
    }
}
let map = {};
module.exports = {
    get(key) {
        if (!map.hasOwnProperty(key)) {
            map[key] = new TimeLock(key);
        }
        return map[key];
    }
};
