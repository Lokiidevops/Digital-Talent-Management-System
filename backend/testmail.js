const dotenv = require("dotenv");
dotenv.config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.log("VERIFY ERROR:", error.message);
  } else {
    console.log("Server is ready to send emails!");
    transporter
      .sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: "DTMS Test",
        text: "Your OTP is 123456",
      })
      .then(() => console.log("Email sent!"))
      .catch((e) => console.log("SEND ERROR:", e.message));
  }
});
