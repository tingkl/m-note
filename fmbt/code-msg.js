class CodeMsg {
    constructor(code, msg, detail, level = 'warning') {
        this.code = code;
        this.msg = msg;
        this.detail = detail;
        this.level = level;
    }
}

CodeMsg.Success = new CodeMsg(0, '成功', '', 'success');

CodeMsg.ServerError = function (detail) {
    return new CodeMsg(-1, '系统错误', detail, 'error');
}
CodeMsg.AsyncValidator = function (detail) {
    return new CodeMsg(-2, '校验不通过', detail, 'error');
}

CodeMsg.InvalidParams = function (detail) {
    return new CodeMsg(-3, '参数有误', detail, 'error');
}

CodeMsg.TimeLock = function (detail) {
    return new CodeMsg(-4, '操作过于频繁', detail, 'error');
}

CodeMsg.AlreadyExists = function (detail) {
    return new CodeMsg(1000, '已经存在', detail);
}
CodeMsg.NotExists = function (detail) {
    return new CodeMsg(1001, '不存在', detail);
}
CodeMsg.WillNeverHappen = function (detail) {
    return new CodeMsg(3000, '不可能发生', detail);
}
CodeMsg.Illegal = function (detail) {
    return new CodeMsg(3002, '不合法的操作', detail);
}

CodeMsg.NotEnoughAuth = function (detail) {
    return new CodeMsg(4000, '权限不足', detail);
}
CodeMsg.NoAccess = function (detail) {
    return new CodeMsg(4001, '无权访问', detail);
}

module.exports = CodeMsg;
