const nodeMailer = require('nodemailer');

const me = {
    send({ service, user, pass, from }, { tos, subject, html, text, attachments }) {
        let transport = nodeMailer.createTransport({
            service,
            secure: true,
            auth: {
                user,
                pass
            }
        });
        // text html 二选一
        // 返回的是一个promise
        return transport.sendMail({
            from,
            to: tos.join(', '),
            subject,
            text,
            html,
            attachments
        });
    }
}
module.exports = me;
