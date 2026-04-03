const express = require("express");
const { 
    register, 
    login, 
    getUsers, 
    updateProfile, 
    toggle2FA,
    verifyEmail
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.get("/users", getUsers);

router.put("/update-profile", protect, upload.single("profilePhoto"), updateProfile);
router.post("/toggle-2fa", protect, toggle2FA);

module.exports = router;
