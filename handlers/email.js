const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');
    
// async..await is not allowed in global scope, must use a wrapper
async function main() {
    
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: false, // true para cifrado TLS o STARTTLS y false cuando no tiene cifrado
        auth: {
            user: emailConfig.username, // generated ethereal user
            pass: emailConfig.password // generated ethereal password
        }
    });

    // Generar HTML
    const generarHTML = (archivo, opciones = {}) => {
        const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
        return juice(html);
    }
    
    // Enviar e-mail
    exports.enviar = async (opciones) => {
        const html = generarHTML(opciones.archivo, opciones);
        const text = htmlToText.htmlToText(html);
        let mailOptions = await transporter.sendMail({
            from: '"Up Task" <no-reply@uptask.com>', // sender address
            to: opciones.usuario.email, // list of receivers
            subject: opciones.subject, // Subject line
            text, // plain text body
            html  // html body
        });

        const enviarEmail = util.promisify( transporter.sendMail, transporter );
        return enviarEmail.call( transporter, mailOptions);
    }

    
    // console.log("Message sent: %s", info.messageId);
    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
    
    // Preview only available when sending through an Ethereal account
    // console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}
    
main().catch(console.error);