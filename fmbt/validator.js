const Validator = require('async-validator').default;
const Exception = require('./exception');
const CodeMsg = require('./code-msg');
const validate = Validator.prototype.validate;
// 不重写validate方法，因为validate如果遇到object类型，会循环调用自己，重写的话可能出问题
Validator.prototype.doValidate = function (source, options = { first: true }) {
    return new Promise((resolve, reject) => {
        if (source) {
            this.validate(source, options).then(function () {
                resolve(source);
            }).catch(function (e) {
                console.log(source, e)
                reject(new Exception(CodeMsg.AsyncValidator(e.errors[0].message)))
            });
        } else {
            reject(new Exception(CodeMsg.InvalidParams('缺少source')));
        }
    });
};
const scopeMap = {}
module.exports = function (scopeName) {
    if (!scopeMap.hasOwnProperty(scopeName)) {
        const target = {};
        const proxyTarget = new Proxy(target, {
            get(target, key) {
                if (!target.hasOwnProperty(key)) {
                    throw `validator.${key} not defined!`
                }
                return target[key];
            },
            set(target, key, descriptor) {
                if (target.hasOwnProperty(key)) {
                    throw `validator.${key} already defined!`
                }
                target[key] = new Validator(descriptor)
            }
        });
        scopeMap[scopeName] = proxyTarget;
    }
    return scopeMap[scopeName];
};

