const nodemailer = require('nodemailer');
const logger = require('./logger');
require('dotenv').config({ path: './env.local' });

const emailConfig = {
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_APP_PASSWORD
    }
};

const transporter = nodemailer.createTransport(emailConfig);

async function sendEmail(to, subject, content, from = process.env.EMAIL_FROM) {
    try {
        const mailOptions = {
            from: from,
            to: to,
            subject: subject,
            html: content
        };

        const result = await transporter.sendMail(mailOptions);
        logger.info('Email sent successfully', { to, subject, messageId: result.messageId });
        return { success: true, messageId: result.messageId };
    } catch (error) {
        logger.error('Error sending email', { to, subject, error: error.message, stack: error.stack });
        return { success: false, error: error.message };
    }
}

async function testEmailConnection() {
    try {
        await transporter.verify();
        logger.info('Email server connection successful');
        return true;
    } catch (error) {
        logger.error('Email server connection failed', { error: error.message, stack: error.stack });
        return false;
    }
}

module.exports = {
    sendEmail,
    testEmailConnection,
    transporter
};