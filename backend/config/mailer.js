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
    tls: {
      rejectUnauthorized: false,
    },
  });

  const info = await transporter.sendMail({
    from: `"DTMS" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "DTMS — Your OTP Code",
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e0e0d8;border-radius:12px">
        <h2 style="color:#166534">DTMS</h2>
        <p style="color:#555">Your OTP for password reset:</p>
        <div style="background:#f0fdf4;border:2px solid #bbf7d0;border-radius:10px;padding:24px;text-align:center;margin:20px 0">
          <span style="font-size:2.5rem;font-weight:700;letter-spacing:12px;color:#166534">${otp}</span>
        </div>
        <p style="color:#888;font-size:.85rem">Expires in 5 minutes. Do not share.</p>
      </div>
    `,
  });

  console.log("OTP email sent:", info.messageId);
};

module.exports = { sendOTP };
