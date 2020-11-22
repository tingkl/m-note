let crypto = require('crypto');
let fs = require('fs');

// hex base64
/**
 *
 0 A     1 B     2 C     3 D     4 E     5 F     6 G     7 H
 8 I     9 J    10 K    11 L    12 M    13 N    14 O    15 P
 16 Q    17 R    18 S    19 T    20 U    21 V    22 W    23 X
 24 Y    25 Z    26 a    27 b    28 c    29 d    30 e    31 f
 32 g    33 h    34 i    35 j    36 k    37 l    38 m    39 n
 40 o    41 p    42 q    43 r    44 s    45 t    46 u    47 v
 48 w    49 x    50 y    51 z    52 0    53 1    54 2    55 3
 56 4    57 5    58 6    59 7    60 8    61 9    62 +    63 /
 *
 * */
function replace(md5) {
    // 升级成不占用url特殊字符
    return md5.replace(/[+/=]/g, function ($0) {
        if ($0 === '/') {
            return '-';
        } else if ($0 === '+') {
            return '_';
        }
        return '';
    });
}

const saltForm ='awesome';
const saltDB = 'amazing';
const me = {
    saltDB,
    saltForm,
    fromFile(filePath, encoding = 'base64') {
        return new Promise((resolve, reject) => {
            let md5Sum = crypto.createHash('md5');
            let stream = fs.createReadStream(filePath);
            let start = Date.now();
            stream.on('data', function (chunk) {
                md5Sum.update(chunk);
            });
            stream.on('end', function () {
                let md5 = md5Sum.digest(encoding);
                if (encoding === 'base64') {
                    md5 = replace(md5);
                }
                console.log('文件:' + filePath + ', MD5签名为:' + md5 + ', 耗时:' + (Date.now() - start) / 1000 + "秒");
                resolve(md5);
            });
            stream.on('error', reject);
        });
    },
    fromText(text, encoding = 'base64') {
        let md5Sum = crypto.createHash('md5');
        md5Sum.update(text);
        let md5 = md5Sum.digest(encoding);
        if (encoding === 'base64') {
            md5 = replace(md5);
        }
        return md5;
    },
    inputPass2FormPass(inputPass) {
        // ""不能省略，否则两个char做int运算了
        let str = '' + saltForm.charAt(0) + saltForm.charAt(2) + inputPass + saltForm.charAt(5) + saltForm.charAt(4);
        let formPass = me.fromText(str, 'hex');
        console.info('inputPass: %s -> str: %s -> formPass: %s', inputPass, str, formPass);
        return formPass;
    },
    formPass2DBPass(formPass) {
        let str = '' + saltDB.charAt(0) + saltDB.charAt(2) + formPass + saltDB.charAt(5) + saltDB.charAt(4);
        let dbPass = me.fromText(str, 'hex');
        console.info('formPass: %s -> dbPass: %s', formPass, dbPass);
        return dbPass;
    }
};
module.exports = me;
