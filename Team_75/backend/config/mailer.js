import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const sendConfirmationEmail = async (email, subject, text) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAILHOST,
    port: process.env.MAILPORT,
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS,
    },
  });

  const mailOptions = {
    from: "justaddtrial@gmail.com",
    to: email,
    subject: subject,
    text: text,
  };

  await transporter.sendMail(mailOptions);
};

export default sendConfirmationEmail;
