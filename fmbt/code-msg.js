class CodeMsg {
    constructor(code, msg, level = 'warning') {
        this.code = code;
        this.msg = msg;
        this.level = level;
    }
}

CodeMsg.Success = new CodeMsg(0, '成功', 'success');
CodeMsg.Tip = new CodeMsg(0, '提示', 'warning');

CodeMsg.ServerError = new CodeMsg(-1, '系统错误', 'error');
CodeMsg.AsyncValidator = function (error) {
    return new CodeMsg(-2, error.errors[0].message, 'error');
};

CodeMsg.InvalidParams = function (msg = '参数有误') {
    return new CodeMsg(-3, msg, 'error');
};

CodeMsg.TimeLock = new CodeMsg(-4, '操作过于频繁', 'error');

// 笔记相关1000
CodeMsg.NoteAlreadyExists = new CodeMsg(1000, '笔记已存在');
CodeMsg.NoteNotExists = new CodeMsg(1001, '笔记不存在');
// 文件夹相关2000
CodeMsg.FolderAlreadyExists = new CodeMsg(2000, '文件夹已存在');
CodeMsg.FolderNotExists = new CodeMsg(2001, '文件夹不存在');
// 空间相关3000
CodeMsg.WillNeverHappen = new CodeMsg(3000, '笔记找不到目录');
CodeMsg.SpaceNotExists = new CodeMsg(3001, '空间不存在');
CodeMsg.CannotDeleteLastSpace = new CodeMsg(3002, '不能删除正在使用的空间');
// 权限相关4000
CodeMsg.NotEnoughAuth = new CodeMsg(4000, '权限不足，请重新登录');
CodeMsg.NoAccess = new CodeMsg(4001, '无权访问');

// 账号相关5000
CodeMsg.EmailInUse = new CodeMsg(5000, '邮箱已被使用');
CodeMsg.AccountNotExists = new CodeMsg(5001, '用户不存在(账号密码有误)');

CodeMsg.Custom = function (msg) {
    return new CodeMsg(10000, msg);
};
module.exports = CodeMsg;
