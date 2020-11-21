const Note = require('./note');
const Folder = require('./folder');
const Space = require('./space');
const Exception = require('../fmbt/exception');
const CodeMsg = require('../fmbt/code-msg');
const cf = require('../fmbt/cf');
const StreamZip = require('node-stream-zip');
const path = require('path');
const sep = path.sep;
module.exports = {
    async space(user, md5Ext) {
        let log = [];
        let spaceName;
        let notes = [];
        let userId = user._id;

        let serverFilePath = cf.getServerFilePath(md5Ext);
        let zip = await this.unzip(serverFilePath);
        for (const entry of Object.values(zip.entries())) {
            if (entry.name.indexOf('__MACOSX') === 0) {

            } else if (entry.isDirectory) {
            } else {
                let file = path.parse(entry.name);
                if (file.ext === '.md') {
                    let parts = file.dir.split(sep);
                    if (parts.length < 2) {
                        log.push({
                            type: 'warning',
                            msg: '跳过一级目录文件:' + entry.name
                        });
                    } else if (parts.length > 2) {
                        log.push({
                            type: 'warning',
                            msg: '跳过三级目录文件:' + entry.name
                        });
                    } else {
                        const data = zip.entryDataSync(entry.name).toString();
                        notes.push({
                            space: parts[0],
                            folder: parts[1],
                            name: file.name,
                            md: data
                        });
                    }
                } else {
                    log.push({
                        type: 'warning',
                        msg: '跳过非.md文件:' + entry.name
                    });
                }
            }
        }
        if (notes.length > 0) {
            spaceName = notes[0].space;
            let finalSpaceName = await Space.getUniqueName(userId, spaceName);
            log.push({
                type: 'success',
                msg: `导入空间'${spaceName}'` + ((spaceName !== finalSpaceName) ? ` 另存为 '${finalSpaceName}'` : '')
            });
            let importSpace = await Space.createSpace(user, finalSpaceName);
            let saveNoteTasks = [];
            let folderMap = {};
            for (let i = 0; i < notes.length; i++) {
                let note = notes[i];
                if (note.space === spaceName) {
                    if (!folderMap.hasOwnProperty(note.folder)) {
                        folderMap[note.folder] = await Folder.createFolder(user, importSpace._id, note.folder);
                        log.push({
                            type: 'success',
                            msg: `导入目录: '${note.folder}'`
                        });
                    }
                    note.folderId = folderMap[note.folder]._id;
                    saveNoteTasks.push(Note.createNote(user, note.folderId, note));
                    log.push({
                        type: 'success',
                        msg: `导入笔记: '${note.name}'`
                    });
                }
            }
            if (saveNoteTasks.length > 0) {
                await Promise.all(saveNoteTasks);
            }
        } else {
            log.push({
                type: 'error',
                msg: '没有可以导入的文件'
            });
        }
        return log;
    },
    async folder(user, spaceId, md5Ext) {
        let log = [];
        let folderName;
        let notes = [];
        let userId = user._id;
        let serverFilePath = cf.getServerFilePath(md5Ext);
        let zip = await this.unzip(serverFilePath);
        for (const entry of Object.values(zip.entries())) {
            if (entry.name.indexOf('__MACOSX') === 0) {

            } else if (entry.isDirectory) {
                folderName = entry.name.split(sep)[0];
            } else {
                let file = path.parse(entry.name);
                if (file.ext === '.md') {
                    let parts = file.dir.split(sep);
                    if (parts.length > 1) {
                        log.push({
                            type: 'warning',
                            msg: '跳过二级目录文件:' + entry.name
                        });
                    } else {
                        const data = zip.entryDataSync(entry.name).toString();
                        notes.push({
                            folder: parts[0],
                            name: file.name,
                            md: data
                        });
                    }
                } else {
                    log.push({
                        type: 'warning',
                        msg: '跳过非.md文件:' + entry.name
                    });
                }
            }
        }
        if (notes.length > 0) {
            folderName = folderName || notes[0].folder;
            let finalFolderName = await Folder.getUniqueName(userId, spaceId, folderName);
            log.push({
                type: 'success',
                msg: `导入目录'${folderName}'` + ((folderName !== finalFolderName) ? ` 另存为 '${finalFolderName}'` : '')
            });
            let importFolder = await Folder.createFolder(user, spaceId, finalFolderName);
            let saveNoteTasks = [];
            notes.forEach(note => {
                // 应该都是相等的吧
                // if (note.folder === folderName) {
                //     saveNoteTasks.push(Note.createNote(user, importFolder._id, note));
                // }
                saveNoteTasks.push(Note.createNote(user, importFolder._id, note));
                log.push({
                    type: 'success',
                    msg: `导入笔记'${note.name}'`
                });
            });
            if (saveNoteTasks.length > 0) {
                await Promise.all(saveNoteTasks);
            }
        } else {
            log.push({
                type: 'error',
                msg: '没有可以导入的文件'
            });
        }
        return log;
    },
    /**
     * Entries read: 7
     entry 接口对接2.0的副本.md false
     entry 接口对接2.0的副本 2.md false
     entry 接口对接2.0.md false
     * */
    async note(user, folderId, md5Ext) {
        let log = [];
        let notes = [];
        let userId = user._id;
        let serverFilePath = cf.getServerFilePath(md5Ext);
        let zip = await this.unzip(serverFilePath);
        for (const entry of Object.values(zip.entries())) {
            if (entry.name.indexOf('__MACOSX') === 0) {

            } else if (entry.isDirectory) {
            } else {
                let file = path.parse(entry.name);
                if (file.ext === '.md') {
                    let parts = file.dir.split(sep);
                    if (parts.length > 1) {
                        log.push({
                            type: 'warning',
                            msg: '跳过二级目录文件:' + entry.name
                        });
                    } else {
                        const data = zip.entryDataSync(entry.name).toString();
                        notes.push({
                            folder: parts[0],
                            name: file.name,
                            md: data
                        });
                    }
                } else {
                    log.push({
                        type: 'warning',
                        msg: '跳过非.md文件:' + entry.name
                    });
                }
            }
        }
        if (notes.length > 0) {
            let saveNoteTasks = [];
            for (let i = notes.length - 1; i >= 0; i--) {
                let note = notes[i];
                let noteName = note.name;
                let finalNoteName = await Note.getUniqueName(userId, folderId, note.name);
                log.push({
                    type: 'success',
                    msg: `导入笔记'${noteName}'` + ((noteName !== finalNoteName) ? ` 另存为 '${finalNoteName}'` : '')
                });
                note.name = finalNoteName;
                saveNoteTasks.push(Note.createNote(user, folderId, note));
            }
            if (saveNoteTasks.length > 0) {
                await Promise.all(saveNoteTasks);
            }
        } else {
            log.push({
                type: 'error',
                msg: '没有可以导入的文件'
            });
        }
        return log;
    },
    unzip(zipFile) {
        return new Promise((resolve, reject) => {
            const zip = new StreamZip({
                file: zipFile,
                storeEntries: true
            });
            zip.on('ready', () => {
                console.log('Entries read: ' + zip.entriesCount);
                resolve(zip);
            });
            // Do not forget to close the file once you're done
            zip.close();
            zip.on('error', err => {
                reject(err);
            });
        });
    }
};
