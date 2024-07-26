const Nodemailer = require('nodemailer');

const mailOptions = {
    from: 'vikas14nov2001@gmail.com',
    to: 'pravinpatekar1999@gmail.com',
    subject: 'Your One Time Password',
    html: `<p>Enter <b>${otp}</b> in the app to reset Password</p>
    <p>This code <b>expires in 1 hour</b></p>`,
};
transporter.sendMail(mailOptions, (error, done) => {
    if (error) return res.status(500).send(error.message);
    else return done;
});

const transporter = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_APP_NAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});