const express = require("express");
const { 
    register, 
    login, 
    getUsers, 
    updateProfile, 
    toggle2FA 
} = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/users", getUsers);

router.put("/update-profile", protect, updateProfile);
router.post("/toggle-2fa", protect, toggle2FA);

module.exports = router;
