/* eslint-disable prettier/prettier */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable prettier/prettier */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-unused-vars */
const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');

module.exports = class Email{
    constructor(user, url){
        this.to = user.email,
        this.firstname = user.name.split(' ')[0],
        this.url = url,
        this.from = `Abdelrahman <${process.env.EMAIL_FORM}>`
    }

    newTransport(){
        return nodemailer.createTransport({
            service: 'gmail',
            host: process.env.GMAIL_HOST,
            port: process.env.GMAIL_PORT,
            secure: false, //! true for 465, false for other ports
            auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD
            }
        });
        }
    
    async send(template, subject){
        const html = pug.renderFile(`${__dirname}/../views/emails/${template}.pug`,
        {
        firstname: this.firstname,
        url: this.url,
        subject });
    const mailOptions = {
    from: this.form,
    to: this.to,
    subject: subject,
    html,
    text: htmlToText.htmlToText(html)
    };
        await this.newTransport().sendMail(mailOptions);
    }

    async sendWelcome() {
    await this.send('welcome', 'Welcome to the QuizApp!');
}

async sendNotification(){
    await this.send('notifaction', 'Notification')
}
    
    async sendPasswordReset() {
        await this.send(
        'passwordReset',
        'Your password reset token (vaild for 10 miuntes)'
    );
}
}


