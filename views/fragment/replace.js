let fs = require('fs');
let glob = require('glob');
//*:匹配路径中某部分:0个或多个字符
glob("../*.ejs",function (er, files) {
    files.forEach(filePath => {
        let html = fs.readFileSync(filePath).toString();
        html = html.replace(/<!--start favicon-->[\s\S]*<!--end favicon-->/m, '<% include fragment/favicon.ejs %>');
        html = html.replace(/<!--start user.title-->[\s\S]*<!--end user.title-->/m, '<% include fragment/user.title.ejs %>');
        html = html.replace(/<!--start config-->[\s\S]*<!--end config-->/m, '<% include fragment/config.ejs %>');

        fs.writeFileSync(filePath, html);
    })
});
