const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    status: {
      type: String,
      enum: ["pending", "submitted", "completed"],
      default: "pending",
    },
    submission: { type: String, default: "" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Task", taskSchema);
