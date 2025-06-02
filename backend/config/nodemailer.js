// import nodemailer from 'nodemailer';
// import fs from 'fs';

// // create a transporter object using SMTP with authentication and TLS
// const transporter = nodemailer.createTransport({
//     host: 'smtp-relay.brevo.com',
//     port: 587,
//     secure: false, 
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//     },
//     tls: {
//         ca: fs.readFileSync('isrgrootx1.pem') // Load Let's Encrypt Root CA to verify SMTP server
//     }
// })

// export default transporter


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

    console.log('recip ', userEmail)
    console.log(process.env.SMTP_USER)
    console.log(process.env.SMTP_PASS)
    console.log('tes')

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