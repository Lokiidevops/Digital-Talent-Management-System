const User = require("../models/User");
const Otp = require("../models/otp");
const { sendOTP } = require("../config/mailer");
const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with this email" });
    await Otp.deleteMany({ email });
    const otp = generateOTP();
    await Otp.create({ email, otp });
    await sendOTP(email, otp);
    res.json({ message: "OTP sent to your email" });
  } catch (err) {
    console.error("Forgot error:", err.message);
    res.status(500).json({ message: "Failed to send OTP", error: err.message });
  }
};

const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp)
    return res.status(400).json({ message: "Email and OTP required" });
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    res.json({ message: "OTP verified successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword)
    return res.status(400).json({ message: "All fields required" });
  if (newPassword.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record)
      return res.status(400).json({ message: "Invalid or expired OTP" });
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    user.password = newPassword;
    await user.save();
    await Otp.deleteMany({ email });
    res.json({ message: "Password reset successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { forgotPassword, verifyOTP, resetPassword };
