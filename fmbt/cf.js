const path = require('path');
const publicDir = 'public';    // 静态文件目录
const uploadDir = 'upload';    // 上传文件目录
const excelDir = 'excel';      // 生成excel目录
const gmDir = 'gm';            // 图片压缩目录
const profile = process.env.NODE_ENV;
console.log('use profile', profile);
const port = 4455;
const gzhMap = {
    prod: {
        appId: '',
        secret: ''
    },
    dev: {
        appId: '',
        secret: ''
    },
    local: {
        appId: '',
        secret: ''
    }
};

const domainMap = {
    local: 'http://localhost:' + port,
    dev: 'http://你的服务域名',
    prod: 'http://你的服务域名'
};

const cdnMap = {
    local: domainMap.local,
    dev: domainMap.dev,
    prod: domainMap.prod
};
module.exports = {
    env: {
        profile, // local dev prod
    },
    port,
    key: '你的key',
    uploadDir,
    publicDir,
    // 上传文件的本地访问urlPath
    uploadUrlPath: '/' + uploadDir,
    excelUrlPath: '/' + excelDir,
    publicDirPath: path.join(__dirname, '..', publicDir),
    uploadDirPath: path.join(__dirname, '..', publicDir, uploadDir),
    gmDirPath: path.join(__dirname, '..', publicDir, gmDir),
    excelDirPath: path.join(__dirname, '..', publicDir, excelDir),
    serverRoot: profile === 'local' ? '/api' : '',
    getServerFilePath(filename) {
        return path.join(this.uploadDirPath, filename);
    },
    isDeveloper(user) {
        return user.account.role === 'admin';
    },
    mongodb() {
        let url = '你的mongodb:27018';
        let replicaSet;
        if (this.env.profile === 'prod') {
            url = 'localhost:27018';
        }
        // else {
        //     url = 'tingkl.com:27018';
        //     // url = 'tingkl.com:27018,tingkl.com:27019';
        //     // replicaSet = 'rs0';
        // }
        return {
            url: `mongodb://账号:密码@${url}/数据库名`,
            option: {
                replicaSet,
                poolSize: 10
            }
        }
    },
    redis() {
        let cf = {
            enableReadyCheck: true,
            db: 3,
            password: '密码'
        };
        if (this.env.profile === 'prod') {
        } else {
            cf.host = '你的redis';
        }
        return cf;
    },
    es () {
        return {
            node: 'http://你的elasticsearch:9200',
            maxRetries: 5,
            requestTimeout: 60000,
            sniffOnStart: true,
            auth: {
                username: '账号',
                password: '密码'
            }
        }
    },
    domain: domainMap[profile],
    cdn: cdnMap[profile],
    gzh: gzhMap[profile]
};
