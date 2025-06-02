import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const sendMail = async(template, emailSubject, otp, userEmail) => {
    let config = {
        service: 'gmail',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    }

    
    let transporter = nodemailer.createTransport(config)
    let mailOptions = {
        from: process.env.SMTP_USER,
        to: userEmail,
        subject: emailSubject,
        html: template.replace("{{otp}}", otp).replace("{{email}}",userEmail),
    }

    try {
        const info = await transporter.sendMail(mailOptions);
        return info;
    } catch (err) {
        console.error('Email sending error:', err);
        throw err;
    }
}