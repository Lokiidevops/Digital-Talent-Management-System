const express = require("express");
const router = express.Router();
const { getPendingAdmins, approveAdmin } = require("../controllers/AdminApprovalController");
const { protect, superAdmin } = require("../middleware/authMiddleware");

// All routes require Super Admin
router.get("/pending", protect, superAdmin, getPendingAdmins);
router.post("/:id", protect, superAdmin, approveAdmin);

module.exports = router;
