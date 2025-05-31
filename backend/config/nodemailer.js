import nodemailer from 'nodemailer';
import fs from 'fs';

// create a transporter object using SMTP with authentication and TLS
const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    secure: false, 
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    tls: {
        ca: fs.readFileSync('isrgrootx1.pem') // Load Let's Encrypt Root CA to verify SMTP server
    }
})

export default transporter