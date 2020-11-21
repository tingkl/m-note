const {Success, Tip} = require('./code-msg');
module.exports = {
    success (data, page, msg) {
        return {
            ...Success,
            msg,
            data,
            page
        };
    },
    tip (msg) {
        return {
            ...Tip,
            msg
        }
    },
    fail (codeMsg, extra) {
        return {
            ...codeMsg,
            extra
        }
    }
};
