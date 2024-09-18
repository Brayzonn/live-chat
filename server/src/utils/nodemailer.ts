import nodemailer from 'nodemailer';
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: "smtp.titan.email",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SENDER_EMAIL,
        pass: process.env.EMAIL_PASSWORD,
    },
    tls: {
        rejectUnauthorized: true
    }
});

const sendMessageNotificationEmail = async (message: string) => {

    const mailOptions = {
        from: process.env.SENDER_EMAIL,
        to: process.env.RECEIVER_EMAIL,
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
