// 业务逻辑侵入固定业务入口
const busLog = require('./util/log').getLogger('bus');
class MyEmitter {
    constructor () {
        this.listeners = {};
    }
    async emit(eventName, ...args) {
        let rs;
        let asyncCb = this.listeners[eventName];
        if (asyncCb) {
            rs = await asyncCb(...args);
        } else {
            busLog.warn({eventName, msg: '没有处理函数', args});
        }
        return rs;
    }
    once (eventName, cb) {
        this.listeners[eventName] = cb;
    }
}
module.exports = new MyEmitter();
