const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  submitTask,
} = require("../controllers/taskController");

// Admin (create/edit/delete)
router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

// User / general (view + submit)
router.get("/", getTasks);
router.post("/submit/:id", submitTask);

module.exports = router;

