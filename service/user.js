const Mongo = require('../fmbt/db/mongo');
const CodeMsg = require('../fmbt/code-msg');
const mongoose = require('mongoose');
const Exception = require('../fmbt/exception');
const Space = require('./space');
const Bus = require('../fmbt/bus');

const VS = require('../fmbt/validator');
const schemaDefinition = {
    wx: {},
    color: {
        space: {
            type: String,
            default: '#2b85e4'
        },
        folder: {
            type: String,
            default: '#19be6b'
        },
        note: {
            type: String,
            default: '#515a6e'
        },
        share: {
            type: String,
            default: '#F26B3A'
        }
    },
    preview: {
        // 预览区域最大宽度
        maxWidth: {
            type: Number,
            default: 1000
        },
        markdown: {
            // 自动空格
            autoSpace: {
                type: Boolean,
                default: true
            },
            // 自动矫正术语
            fixTermTypo: {
                type: Boolean,
                default: true
            },
            // 自动矫正标点
            chinesePunct: {
                type: Boolean,
                default: true
            },
            // ==Mark 标记==语法
            mark: {
                type: Boolean,
                default: true
            }
        },
        theme: {
            current: {
                type: String,
                enum: ['light', 'dark', 'wechat', 'ant-design'],
                default: 'ant-design'
            }
        },
        hljs: {
            lineNumber: {
                type: Boolean,
                default: false
            },
            style: {
                type: String,
                enum: [
                    'abap',
                    'algol',
                    'algol_nu',
                    'arduino',
                    'autumn',
                    'borland',
                    'bw',
                    'colorful',
                    'dracula',
                    'emacs',
                    'friendly',
                    'fruity',
                    'github',
                    'igor',
                    'lovelace',
                    'manni',
                    'monokai',
                    'monokailight',
                    'murphy',
                    'native',
                    'paraiso-dark',
                    'paraiso-light',
                    'pastie',
                    'perldoc',
                    'pygments',
                    'rainbow_dash',
                    'rrt',
                    'solarized-dark',
                    'solarized-dark256',
                    'solarized-light',
                    'swapoff',
                    'tango',
                    'trac',
                    'vim',
                    'vs',
                    'xcode',
                    'ant-design'
                ],
                default: 'dracula'
            }
        },
        math: {
            inlineDigit: {
                type: Boolean,
                default: false
            },
            style: {
                type: String,
                enum: ['KaTeX', 'MathJax'],
                default: 'KaTeX'
            }
        }
    },
    account: {
        name: {
            type: String,
            index: true
        },
        password: String,
        email: {
            type: String,
            index: true,
            unique: true
        },
        // 自我简介
        desc: {
            type: String,
            default: ''
        },
        // 喜欢的话
        word: {
            type: String,
            default: ''
        },
        photo: {
            type: mongoose.Schema.Types.Mixed,
            required: true,
            default() {
                return Math.ceil(Math.random() * 23);
            }
        }
    },
    page: {
        link: {
            type: String,
            default: '# 友情链接'
        },
        contact: {
            type: String,
            default: '# 联系方式'
        }
    },
    tj: {
        openNoteCount: {
            type: Number,
            default: 0
        }
    },
    time: {
        create: {
            type: Number,
            default() {
                return Date.now()
            }
        },
        signIn: {
            type: Number,
            default() {
                return Date.now()
            }
        },
        update: {
            type: Number,
            default() {
                return Date.now()
            }
        }
    }
};
VS.UserColor = {
    space: {
        required: true
    },
    folder: {
        required: true
    },
    note: {
        required: true
    },
    share: {
        required: true
    }
};
VS.UserAccount = {
    photo: {
        required: true
    },
    name: {
        required: true
    },
    email: {
        required: true, type: 'email'
    }
};

VS.UserPreview = {
    maxWidth: {
        type: 'number',
        required: true
    },
    markdown: {
        type: 'object',
        required: true,
        fields: {
            // 自动空格
            autoSpace: {
                type: 'boolean',
                required: true
            },
            // 自动矫正术语
            fixTermTypo: {
                type: 'boolean',
                required: true
            },
            // 自动矫正标点
            chinesePunct: {
                type: 'boolean',
                required: true
            },
            // ==Mark 标记==语法
            mark: {
                type: 'boolean',
                required: true
            }
        }
    },
    theme: {
        type: 'object',
        required: true,
        fields: {
            current: {
                type: 'enum',
                enum: ['light', 'dark', 'wechat', 'ant-design']
            }
        }
    },
    hljs: {
        type: 'object',
        required: true,
        fields: {
            lineNumber: {
                type: 'boolean',
                required: true
            },
            style: {
                type: 'enum',
                enum: [
                    'abap',
                    'algol',
                    'algol_nu',
                    'arduino',
                    'autumn',
                    'borland',
                    'bw',
                    'colorful',
                    'dracula',
                    'emacs',
                    'friendly',
                    'fruity',
                    'github',
                    'igor',
                    'lovelace',
                    'manni',
                    'monokai',
                    'monokailight',
                    'murphy',
                    'native',
                    'paraiso-dark',
                    'paraiso-light',
                    'pastie',
                    'perldoc',
                    'pygments',
                    'rainbow_dash',
                    'rrt',
                    'solarized-dark',
                    'solarized-dark256',
                    'solarized-light',
                    'swapoff',
                    'tango',
                    'trac',
                    'vim',
                    'vs',
                    'xcode',
                    'ant-design'
                ]
            }
        }
    },
    math: {
        type: 'object',
        required: true,
        fields: {
            inlineDigit: {
                type: 'boolean',
                required: true
            },
            style: {
                type: 'enum',
                enum: ['KaTeX', 'MathJax']
            }
        }
    }
};


class User extends Mongo {
    // https://www.jianshu.com/p/8b04f4e69296?from=timeline
    // 多文档事务执行的时候,不会自动创建命名空间. 也就是说,如果你的collection还未建立的话, 你执行事务的时候会报错.
    // async signUpByAccount(account) {
    //     let user = await this.findOne({'account.email': account.email});
    //     if (!user) {
    //         const session = await this.getSession();
    //         session.startTransaction();
    //         try {
    //             const opts = {session};
    //             user = await this.save({account}, opts);
    //             let firstSpace = await Space.createFirstSpace(user, opts);
    //             user = await this.findByIdAndUpdate(user._id, {status: {lastSpace: firstSpace}}, {opts});
    //             await session.commitTransaction();
    //             return user;
    //         } catch (e) {
    //             await session.abortTransaction();
    //             throw e;
    //         } finally {
    //             session.endSession();
    //         }
    //     } else {
    //         throw new Exception(CodeMsg.EmailInUse);
    //     }
    // }
    basic(userId) {
        // note.html需要指定作者的样式设置
        return this.findById(userId, {wx: 0, time: 0, 'account.password': 0, 'account.email': 0});
    }

    searchPageOfOpen(page) {
        let condition = {
            'tj.openNoteCount': {$gt: 0}
        };
        return this.findWithPage(condition, page, {'tj.openNoteCount': -1}, {
            wx: 0,
            settings: 0,
            'account.password': 0
        });
    }

    async updateAccount(user, account) {
        let {photo, name, email, desc} = await VS.UserAccount.doValidate(account);
        return this.findByIdAndUpdate(user._id, {'account.photo': photo, 'account.name': name, 'account.email': email, 'account.desc': desc});
    }

    async updatePreviewColor(user, {preview, color}) {
        let update = {};
        if (preview) {
            await VS.UserPreview.doValidate(preview);
            update.preview = preview
        }
        if (color) {
            await VS.UserColor.doValidate(color);
            update.color = color;
        }
        return this.findByIdAndUpdate(user._id, update);
    }

    updateTheme(user, {theme}) {
        return this.findByIdAndUpdate(user._id, {'preview.theme.current': theme});
    }

    updateStyle(user, {style}) {
        return this.findByIdAndUpdate(user._id, {'preview.hljs.style': style});
    }

    async signUpByAccount(account) {
        let user = await this.findOne({'account.email': account.email});
        if (!user) {
            user = await this.save({account});
            await Space.createFirstSpace(user, 'My First Space');
            return user;
        } else {
            throw new Exception(CodeMsg.EmailInUse);
        }
    }

    async signInByAccount(account) {
        let condition = {
            'account.email': account.email,
            'account.password': account.password
        };
        let user = await this.findOneAndUpdate(condition, {'time.signIn': Date.now()});
        if (user) {
            return user;
        }
        throw new Exception(CodeMsg.AccountNotExists);
    }
}

const service = new User(schemaDefinition, Schema => {
    // Schema.virtual('isLocked').get(function () {
    //     return !!(this.lockUntil && this.lockUntil > Date.now());
    // });
    return {
        'account.password': 0
    }
});

Bus.once('openNote + n', function ({n, userId}) {
    return service.findByIdAndUpdate(userId, {$inc: {'tj.openNoteCount': n}});
});
Bus.once('openNote - n', function ({n, userId}) {
    return service.findByIdAndUpdate(userId, {$inc: {'tj.openNoteCount': -n}});
});

module.exports = service;
