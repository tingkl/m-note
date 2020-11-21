const cheerio = require('cheerio');
const marked = require('marked');
module.exports = {
    markedCheerio(md) {
        let html = marked(md);
        let $ = cheerio.load(html);
        let firstImg = $('img').eq(0);
        return {text: $('body').text().replace(/\[TOC\]|\s+/g, ' '), firstImg: firstImg ? firstImg.attr('src') : ''};
    }
};
