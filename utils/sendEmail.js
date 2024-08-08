const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: "snaiki282@gmail.com", // Use environment variables for email credentials
        pass: "fvxj mdok ehij gihc",
    },
});

const sendEmail = (to, subject, text) => {
    const mailOptions = {
        from: "snaiki282@gmail.com",
        to,
        subject,
        text,
    };

    return transporter.sendMail(mailOptions);
};

module.exports = sendEmail;