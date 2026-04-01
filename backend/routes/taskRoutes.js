const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
  submitTask,
} = require("../controllers/TaskController");

router.post("/", upload.single("file"), createTask);
router.put("/:id", updateTask);
router.delete("/:id", deleteTask);

router.get("/", getTasks);
router.post("/submit/:id", submitTask);

module.exports = router;
