require("dotenv").config();
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const nodemailer = require("nodemailer");

const sendOTP = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"DTMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "DTMS — Your OTP Code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0d8;border-radius:12px">
        <h2 style="color:#0d1117">DTMS</h2>
        <p style="color:#555">Your OTP for password reset:</p>
        <div style="background:#f8fafc;border:2px solid #e2e8f0;border-radius:10px;padding:24px;text-align:center;margin:20px 0">
          <span style="font-size:2.5rem;font-weight:700;letter-spacing:12px;color:#0d1117">${otp}</span>
        </div>
        <p style="color:#888;font-size:.85rem">Expires in 5 minutes. Do not share.</p>
      </div>
    `,
  });
};

module.exports = { sendOTP };
