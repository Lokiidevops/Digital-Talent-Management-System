const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "in-progress", "submitted", "completed"],
      default: "pending",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    deadline: { type: Date, default: null },
    assignedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    submissionText: { type: String, default: "" },
    submissionFileUrl: { type: String, default: "" },
    taskFileUrl: { type: String, default: "" },
    taskFileType: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
