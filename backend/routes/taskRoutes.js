const express = require("express");
const router = express.Router();

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  submitTask,
} = require("../controllers/TaskController");

router.post("/", createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.get("/", getTasks);
router.post("/submit/:id", submitTask);

module.exports = router;
