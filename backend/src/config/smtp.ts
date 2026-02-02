import nodemailer from "nodemailer";

export const smtpTransporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
        user: process.env.ETHEREAL_USER!,
        pass: process.env.ETHEREAL_PASS!
    }
});