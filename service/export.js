const Note = require('./note');
const Folder = require('./folder');
const Space = require('./space');
const Zip = require('../fmbt/util/zip');
const Exception = require('../fmbt/exception');
const CodeMsg = require('../fmbt/code-msg');
module.exports = {
    async note(my, noteId, ctx) {
        let note = await Note.findById(noteId);
        if (note) {
            let zip = new Zip();
            if (note.userId !== my._id) {
                zip.appendFile(note.name + '/.forbidden', '只能导出自己的笔记');
            } else {
                let filename = note.name + '.md';
                zip.appendFile(filename, note.md);
            }
            let buffer = await zip.getBuffer();
            ctx.set('Content-disposition', 'attachment; filename=' + encodeURI(note.name) + '.zip');
            ctx.set('content-type', 'application/zip; charset=utf-8');
            ctx.set('Content-Length', buffer.length);
            return buffer;
        }
        throw new Exception(CodeMsg.NotExists('笔记'));

    },
    async folder(my, folderId, ctx) {
        let folder = await Folder.findById(folderId);
        if (folder) {
            let zip = new Zip();
            if (folder.userId !== my._id) {
                zip.appendFile(folder.name + '/.forbidden', '只能导出自己的目录');
            } else {
                let notes = await Note.mySearch(my, {inUse: true, folderId});
                if (notes.length > 0) {
                    notes.forEach(note => {
                        zip.appendFile(folder.name + '/' + note.name + '.md', note.md);
                    });
                } else {
                    zip.appendFile(folder.name + '/.empty', '没有文件');
                }
            }
            let buffer = await zip.getBuffer();
            ctx.set('Content-disposition', 'attachment; filename=' + encodeURI(folder.name) + '.zip');
            ctx.set('Content-Type', 'application/zip; charset=utf-8');
            ctx.set('Content-Length', buffer.length);
            return buffer;
        }
        throw new Exception(CodeMsg.NotExists('目录'));
    },
    async space(my, spaceId, ctx) {
        let space = await Space.findById(spaceId);
        if (space) {
            let zip = new Zip();
            if (space.userId !== my._id) {
                zip.appendFile(space.name + '/.forbidden', '只能导出自己的空间');
            } else {
                let folders = await Folder.mySearch(my, {inUse: true, spaceId});
                let notes = await Note.mySearch(my, {
                    inUse: true,
                    folderId: {$in: folders.map(folder => folder._id.toString())}
                });
                let folderMap = {};
                if (notes.length > 0) {
                    notes.forEach(note => {
                        if (!folderMap.hasOwnProperty(note.folderId)) {
                            let folder = folders.find(folder => folder._id.toString() === note.folderId);
                            if (folder) {
                                folderMap[note.folderId] = folder;
                            } else {
                                throw new Exception(CodeMsg.WillNeverHappen('笔记找不到目录'));
                            }
                        }
                        let folder = folderMap[note.folderId];
                        zip.appendFile(space.name +
                            '/' + folder.name + '/' + note.name + '.md', note.md);
                    });
                } else {
                    zip.appendFile(space.name + '/.empty', '没有文件');
                }
            }
            let buffer = await zip.getBuffer(ctx);
            ctx.set('Content-disposition', 'attachment; filename=' + encodeURI(space.name) + '.zip');
            ctx.set('content-type', 'application/zip; charset=utf-8');
            ctx.set('Content-Length', buffer.length);
            return buffer;
        }
        throw new Exception(CodeMsg.NotExists('空间'));
    }
};
