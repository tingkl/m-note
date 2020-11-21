const Note = require('./note');
const HtmlUtil = require('../fmbt/util/html');
async function fixPreview() {
    let notes = await Note.find({});
    let tasks = [];
    notes.forEach(note => {
        // if (!note.preview)  {
            tasks.push(Note.findByIdAndUpdate(note._id, {preview: HtmlUtil.markedCheerio(note.md).substr(0, 160) }));
        // }
    });
    await Promise.all(tasks);
}
fixPreview();
