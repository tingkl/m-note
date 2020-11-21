const schedule = require('node-schedule');
const Note = require('./note');
const Folder = require('./folder');
const Space = require('./space');

/**
 * 每分钟的第30秒触发： '30 * * * * *'
 * 每小时的1分30秒触发 ：'30 1 * * * *'
 * 每天的凌晨1点1分30秒触发 ：'30 1 1 * * *'
 * 每月的1日1点1分30秒触发 ：'30 1 1 1 * *'
 * 2016年的1月1日1点1分30秒触发 ：'30 1 1 1 2016 *'
 * 每周1的1点1分30秒触发 ：'30 1 1 * * 1'
 * */
module.exports = function () {
    schedule.scheduleJob('30 1 1 * * *', async function () {
        let clearNote = await Note.clearExpire(14);
        let clearFolder = await Folder.clearExpire(14);
        let clearSpace = await Space.clearExpire(14);
        console.log(clearNote);
        console.log(clearFolder);
        console.log(clearSpace);
    });
};
