const express = require('express');
const Nodemailer = require('nodemailer');
require('dotenv').config(); // Ensure you have a .env file with your email credentials

const app = express();
app.use(express.json()); // For parsing application/json

const transporter = Nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_APP_NAME,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const mailer = {
    newmailer: async (req, res) => {
        try {
            console.log({
                user: process.env.EMAIL_APP_NAME,
                pass: process.env.EMAIL_PASSWORD,
            });
            const { to } = req.body;

            const mailOptions = {
                from: 'jinar999@gmail.com',
                to: to,
                subject: 'Welcome to Wattmonk Technologies, Your Organizational Email and Next Steps',
                html: `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Email Template</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f9f9f9;
                        margin: 0;
                        padding: 0;
                    }
                    .container {
                        width: 100%;
                        max-width: 600px;
                        margin: 0 auto;
                        background-color: #ffffff;
                        border: 1px solid #ddd;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    .header {
                        padding: 20px;
                        text-align: center;
                        border-bottom: 1px solid #ddd;
                    }
                    .header img {
                        max-width: 150px;
                    }
                    .content {
                        padding: 20px;
                    }
                    .content h1 {
                        font-size: 20px;
                        margin-top: 0;
                    }
                    .content p {
                        font-size: 16px;
                        line-height: 1.5;
                    }
                    .content .details {
                        margin-top: 20px;
                    }
                    .content .details p {
                        margin: 5px 0;
                    }
                    .footer {
                        padding: 20px;
                        text-align: center;
                        border-top: 1px solid #ddd;
                        background-color: #f1f1f1;
                    }
                    .footer p {
                        font-size: 14px;
                        margin: 5px 0;
                    }
                    .footer a {
                        text-decoration: none;
                        color: #333;
                    }
                    .social-icons img {
                        max-width: 20px;
                        margin: 0 5px;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <img style="width: 50px;" src="https://speed.wattmonk.com/assets/images/logo/wattmonklogo.png" alt="Wattmonk Technologies.">
                        <h2 style="margin: 0px;" >Wattmonk Technologies</h2>
                    </div>
                    <div class="content">
                        <p>Hello ,</p>
                        <p>Welcome to the team at Wattmonk Technologies , We are thrilled to have you on board.
                            To get you started, we have set up your organizational email address. Please find the details below:</p>
                        <div class="details">
                            <p>Username: <span style="font-weight: bold;" >acdsee@wattmonk.com</span></p>
                            <p>Password: <span style="font-weight: bold;" >abrakadabra@1234</span></a></p>
                        </div>
                        <p>Please log in to your email account using the above credentials.</p>
                        <p>Regards,</p>
                        <p>Wattmonk Technologies</p>
                    </div>
                    <div class="footer">
                        <div class="social-icons">
                            <a href="#"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/900px-Instagram_icon.png?20200512141346" alt="Instagram"></a>
                            <a href="#"><img src="https://cdn.iconscout.com/icon/premium/png-256-thumb/facebook-2752192-2285009.png?f=webp" alt="Facebook"></a>
                        </div>
                        <p>© 2024 Wattmonk Technologies. All Rights Reserved.</p>
                        <p>Unit 418/419 , Udyog Vihar , Phase - 4 , Gurugram (Haryana) , India</p>
                    </div>
                </div>
            </body>
            </html>`,
            };

            await transporter.sendMail(mailOptions);
            return res.status(200).send('Email sent successfully');
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Internal Server Error');
        }
    },
    healthmail: async (req, res) => {
        try {
            console.log({ msg: "Mail API is working." });
            res.status(200).json({ msg: "Mail API is working." });
        } catch (error) {
            console.error('Error in health check:', error);
            res.status(500).json({ msg: "Internal Server Error" });
        }
    }
};

module.exports = mailer;
