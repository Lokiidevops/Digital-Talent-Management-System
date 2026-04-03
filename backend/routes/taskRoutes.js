const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  submitTask,
  getMyTasks,
  getAdminStats,
} = require("../controllers/TaskController");

// Admin only
router.post("/", protect, admin, upload.single("file"), createTask);
router.get("/all", protect, admin, getTasks);
router.get("/stats", protect, admin, getAdminStats);
router.put("/admin/:id", protect, admin, updateTask);
router.delete("/:id", protect, admin, deleteTask);

// User and Admin
router.get("/my", protect, getMyTasks);
router.put("/:id", protect, updateTask); 
router.post("/submit/:id", protect, upload.single("file"), submitTask);

module.exports = router;
