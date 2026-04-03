const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const crypto = require("crypto");
const EmailService = require("../services/EmailService");

const register = async (req, res) => {
  const { firstName, lastName, name, email, password, role } = req.body;
  const fullName = firstName && lastName ? `${firstName} ${lastName}` : name;
  
  if (!fullName || !email || !password)
    return res.status(400).json({ message: "All fields are required" });

  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(409).json({ message: "Email already exists" });

    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

    // Special case for lead admin to bypass approval for testing
    const isSpecialAdmin = email === "lokeshrohit234@gmail.com";
    
    const user = await User.create({ 
      name: fullName, email, password, role, 
      verificationToken, verificationTokenExpire,
      isApproved: isSpecialAdmin ? true : (role !== "admin"),
      isVerified: isSpecialAdmin ? true : false
    });

    await EmailService.sendVerificationEmail(email, verificationToken);

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role,
        profilePhoto: user.profilePhoto,
        position: user.position,
        twoFactorEnabled: user.twoFactorEnabled
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { token } = req.query;
  const user = await User.findOne({ verificationToken: token, verificationTokenExpire: { $gt: Date.now() } });
  
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  res.json({ message: "Email verified successfully! You can now log in." });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  
  if (!user || !(await user.matchPassword(password)))
    return res.status(401).json({ message: "Invalid email or password" });

  if (!user.isVerified)
    return res.status(403).json({ message: "Please verify your email first" });

  if (user.role === "admin" && !user.isApproved)
    return res.status(403).json({ message: "Admin access pending approval" });

  // Security Alert for Admin Logins
  if (user.role === "admin" || user.role === "superadmin") {
    EmailService.sendAdminLoginAlert(user.email).catch(console.error);
  }

  res.json({
    message: "Login successful",
    token: generateToken(user._id),
    user: { 
      id: user._id, 
      name: user.name, 
      email: user.email, 
      role: user.role,
      profilePhoto: user.profilePhoto,
      position: user.position,
      twoFactorEnabled: user.twoFactorEnabled
    }
  });
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find().select("_id name email role position");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, position, password } = req.body;
    console.log("Update Profile Data Received:", { name, position, file: req.file ? "present" : "none" });

    const user = await User.findById(req.user._id).select("+password");
    if (!user) {
      console.error("User not found during update:", req.user._id);
      return res.status(404).json({ message: "User not found" });
    }

    const updateData = {
      name: name || user.name,
      email: user.email,
      position: position || user.position,
    };

    if (req.file) {
      updateData.profilePhoto = `/uploads/profiles/${req.file.filename}`;
      console.log("Saving new profile photo path:", updateData.profilePhoto);
    }

    if (password && password.trim() !== "") {
      console.log("Password change detected, using .save() for hashing");
      user.name = updateData.name;
      user.position = updateData.position;
      if (updateData.profilePhoto) user.profilePhoto = updateData.profilePhoto;
      user.password = password;
      await user.save();
    } else {
      console.log("Standard update, using findByIdAndUpdate");
      await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });
    }

    const updatedUser = await User.findById(req.user._id).select("-password -verificationToken -verificationTokenExpire");
    console.log("Update successful for user:", updatedUser.email);

    res.json({
      message: "Profile updated successfully",
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        position: updatedUser.position,
        profilePhoto: updatedUser.profilePhoto,
        twoFactorEnabled: updatedUser.twoFactorEnabled,
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const toggle2FA = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.twoFactorEnabled = !user.twoFactorEnabled;
    await user.save();
    
    res.json({
      message: `2FA ${user.twoFactorEnabled ? 'enabled' : 'disabled'} successfully`,
      twoFactorEnabled: user.twoFactorEnabled
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login, verifyEmail, getUsers, updateProfile, toggle2FA };
