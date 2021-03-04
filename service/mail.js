const MU = require('../fmbt/util/mail');
const uuid = require('uuid');
const {user, pass} = require('../fmbt/cf').email;
const fs = require('fs');
const me = {
    async sendAuth (authId, toEmail) {
        let cid = uuid.v1();
        let rs = await MU.send({
            service: 'qq',
            user,
            pass,
            from: '"MNote" <' + user + '@qq.com>'
        }, {
            tos: [toEmail],
            subject: '来自于MNote的认证链接',
            html: 
            `<img src="cid:${cid}"/><br/>
            <a href="https://mnote.tingkl.com?authId=${authId}" target="_blank">https://mnote.tingkl.com?authId=${authId}, 点击链接认证邮箱</a>
            `,
            attachments: [{
                filename: 'image.png',
                path: fs.join(__dirname, '../public/favicon.png'),
                cid
            }]
        });

        /**
         * { accepted: [ 'xxx@qq.com' ],
         *  rejected: [],
         *  envelopeTime: 226,
         *  messageTime: 483,
         *  messageSize: 7287,
         *  response: '250 OK: queued as.',
         *  envelope: { from: 'xxx@qq.com', to: [ 'xxx@qq.com' ] },
         *  messageId: '<2c18ed71-e198-d12a-69f4-7b4d3caf418b@qq.com>' }
         * 
         */
        if (rs && rs.response && rs.response.indexOf('OK') > -1) {
            return true;
        }
        return false;
    }
}
module.export = me;

