const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

exports.sendVerificationEmail = async (email, token) => {
    const url = `http://localhost:3000/verify-email?token=${token}`;
    await transporter.sendMail({
        from: `"DTMS Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "DTMS: Verify Your Email",
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
            <h2 style="color: #6366f1;">Welcome to DTMS!</h2>
            <p>Please verify your email to activate your account and request admin access.</p>
            <a href="${url}" style="display: inline-block; padding: 12px 24px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Verify My Email</a>
            <p style="font-size: 12px; color: #666; margin-top: 20px;">Or copy/paste this link: ${url}</p>
        </div>
        `,
    });
};

exports.sendApprovalEmail = async (email, status) => {
    const isApproved = status === "active";
    await transporter.sendMail({
        from: `"DTMS Admin" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `Your DTMS Admin Access: ${isApproved ? "Approved" : "Rejected"}`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #ddd; border-radius: 10px; padding: 20px;">
            <h2 style="color: ${isApproved ? "#10b981" : "#ef4444"};">${isApproved ? "Account Activated!" : "Access Update"}</h2>
            <p>${isApproved ? "Congratulations! Your admin account has been approved and is now active." : "Unfortunately, your admin access request was not approved at this time."}</p>
            ${isApproved ? '<a href="http://localhost:3000/dashboard" style="display: inline-block; padding: 12px 24px; background: #10b981; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px;">Go to Dashboard</a>' : ""}
        </div>
        `,
    });
};

exports.sendAdminLoginAlert = async (adminEmail) => {
    await transporter.sendMail({
        from: `"DTMS Security" <${process.env.EMAIL_USER}>`,
        to: "lokeshrohit234@gmail.com",
        subject: "🚨 SECURITY ALERT: Admin Login Detected",
        html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #ef4444; border-radius: 8px;">
            <h2 style="color: #ef4444;">Admin Login Alarm</h2>
            <p>An admin account has just logged into the system.</p>
            <p><strong>Admin Email:</strong> ${adminEmail}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <p style="color: #666; font-size: 13px; margin-top: 20px;">If this wasn't you, please reset your password immediately.</p>
        </div>
        `,
    });
};
