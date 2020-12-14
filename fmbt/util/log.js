const log4js = require('log4js');
const layouts = require('log4js/lib/layouts');
let dateFormat = require('dateformat');
let path = require('path');
log4js.addLayout('json', function(config) {
    return function(log) {
        log.data.forEach((item, i) => {
            if (item) {
                if (item instanceof Error) {
                    log.data[i] = item.toString();
                }
            }
        });
        return JSON.stringify({level: log.level.levelStr, time: dateFormat(log.startTime, "yy/mm/dd HH:MM:s:l"), app: log.categoryName, data: log.data}) + config.separator;
    }
});
log4js.addLayout('colored-json', function(config) {
    return function(log, timezoneOffset) {
        let path = '';
        log.data.forEach((item, i) => {
            if (item) {
                let msg = '';
                if (item instanceof Error) {
                    msg = item.toString();
                } else {
                    if (item.app) {
                        path = item.app + '/' + (item.apiName ? item.apiName : '');
                    }
                    json = JSON.stringify(item);
                }
                log.data[i] = json;
            }
        });
        if (path) {
            log.categoryName = path;
        }
        return layouts.coloredLayout(log, timezoneOffset);
    };
});
let config = {
    // pm2不失效
    pm2: true,
    pm2InstanceVar: 'INSTANCE_ID',
    replaceConsole: true,
    appenders: {
        out: {
            type: 'stdout',
            layout: {
                type: 'colored-json',
                separator: ','
            }
        },
        file: {
            type: 'file',
            filename: path.join(__dirname, '..', '..', 'log', 'error.log'),
            maxLogSize: 1024 * 1024 * 10,
            keepFileExt: true,
            backups: 3 // 10M一个文件，最多保留30M
        },
        // dateFile: {
        //     type: 'dateFile',
        //     filename: path.join(__dirname, 'access'),
        //     pattern: '_yy-MM-dd.log',
        //     alwaysIncludePattern: true,
        //     layout: {
        //         type: 'json',
        //         separator: ','
        //     }
        // },
        multiFile: {
            type: 'multiFile',
            base: path.join(__dirname, '..', '..', 'log'),
            property: 'categoryName',
            extension: '.log',
            maxLogSize: 1024 * 1024 * 10,
            keepFileExt: true,
            backups: 5, // 10M一个文件，最多保留30M
            layout: {
                type: 'json',
                separator: ','
            }
        }
    },
    categories: {
        default: {appenders: ['multiFile', 'out'], level: 'trace'},
        trace: {appenders: ['out'], level: 'trace'},
        error: {appenders: ['file', 'out'], level: 'error'}
    }
};
log4js.configure(config);
module.exports = log4js;

