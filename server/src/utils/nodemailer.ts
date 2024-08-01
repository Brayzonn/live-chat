import nodemailer from 'nodemailer';
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS,
    },
    tls: {
        rejectUnauthorized: true
    }
});

const sendMessageNotificationEmail = async (message: string) => {

    const mailOptions = {
        from: process.env.senderEmail,
        to: process.env.receiverEmail,
        subject: 'New Message From Chatbot!',
        html: `${message}`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log('Failed to send email', error);
    }
};


export default sendMessageNotificationEmail;
