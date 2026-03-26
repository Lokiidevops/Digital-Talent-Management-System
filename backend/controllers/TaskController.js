const Task = require("../models/Task");
const User = require("../models/User");

const resolveAssignedUserId = async (body) => {
  const assignedUserId =
    body.assignedUserId || body.assignedUser || body.assignedUser_id;
  const assignedUserEmail = body.assignedUserEmail;

  if (assignedUserId) {
    const user = await User.findById(assignedUserId).select("_id email name");
    if (!user) throw new Error("Assigned user not found");
    return user._id;
  }

  if (assignedUserEmail) {
    const email = String(assignedUserEmail).toLowerCase().trim();
    const user = await User.findOne({ email }).select("_id email name");
    if (!user) throw new Error("Assigned user email not found");
    return user._id;
  }

  return null;
};

const normalizeDeadline = (deadline) => {
  if (!deadline) return null;
  const d = new Date(deadline);
  return Number.isNaN(d.getTime()) ? null : d;
};

const populateTask = (query) =>
  query.populate("assignedUser", "name email").populate("submittedBy", "name email");

// Admin: Create Task
exports.createTask = async (req, res) => {
  try {
    const assignedUser = await resolveAssignedUserId(req.body);
    if (!assignedUser) {
      return res.status(400).json({
        message: "assignedUser is required (use assignedUserId or assignedUserEmail)",
      });
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description || "",
      deadline: normalizeDeadline(req.body.deadline),
      priority: req.body.priority || "medium",
      assignedUser,
      status: "pending",
    });

    const populated = await populateTask(Task.findById(task._id));
    return res.json(populated);
  } catch (err) {
    return res.status(400).json({ message: err.message || "Failed to create task" });
  }
};

// Admin: Get All Tasks
exports.getTasks = async (req, res) => {
  const tasks = await populateTask(
    Task.find().sort({ createdAt: -1 }),
  );
  return res.json(tasks);
};

// User: Get Tasks assigned to me
exports.getMyTasks = async (req, res) => {
  const tasks = await populateTask(
    Task.find({ assignedUser: req.user._id }).sort({ deadline: 1, createdAt: -1 }),
  );
  return res.json(tasks);
};

// Admin: Update Task
exports.updateTask = async (req, res) => {
  const existing = await Task.findById(req.params.id);
  if (!existing) return res.status(404).json({ message: "Task not found" });

  const updates = {};
  if (typeof req.body.title === "string") updates.title = req.body.title;
  if (typeof req.body.description === "string") updates.description = req.body.description;
  if (Object.prototype.hasOwnProperty.call(req.body, "deadline")) {
    updates.deadline = normalizeDeadline(req.body.deadline);
  }
  if (req.body.priority) updates.priority = req.body.priority;

  const shouldUpdateAssigned =
    req.body.assignedUserId || req.body.assignedUserEmail || req.body.assignedUser;
  if (shouldUpdateAssigned) {
    updates.assignedUser = await resolveAssignedUserId(req.body);
  }

  if (req.body.status) updates.status = req.body.status;

  const updated = await populateTask(
    Task.findByIdAndUpdate(req.params.id, updates, { new: true }),
  );
  return res.json(updated);
};

// Admin: Delete Task
exports.deleteTask = async (req, res) => {
  await Task.findByIdAndDelete(req.params.id);
  return res.json({ message: "Deleted" });
};

// User: Submit Task (text + optional file)
exports.submitTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ message: "Task not found" });

  const isAdmin = req.user?.role === "admin";
  if (!isAdmin && String(task.assignedUser) !== String(req.user._id)) {
    return res.status(403).json({ message: "You can only submit your assigned task" });
  }

  const submissionText = String(
    req.body.submissionText ?? req.body.submission ?? "",
  );

  const submissionFileUrl = req.file
    ? `/uploads/submissions/${req.file.filename}`
    : task.submissionFileUrl || "";

  const updated = await populateTask(
    Task.findByIdAndUpdate(
      req.params.id,
      {
        submissionText,
        submissionFileUrl,
        submittedBy: req.user._id,
        status: "submitted",
      },
      { new: true },
    ),
  );

  return res.json(updated);
};

// Admin: Overview stats for cards + charts
exports.getAdminStats = async (req, res) => {
  const now = new Date();

  const [total, completed, pending, submitted, overdue, statusCounts, priorityCounts] =
    await Promise.all([
      Task.countDocuments(),
      Task.countDocuments({ status: "completed" }),
      Task.countDocuments({ status: "pending" }),
      Task.countDocuments({ status: "submitted" }),
      Task.countDocuments({ status: { $ne: "completed" }, deadline: { $lt: now } }),
      Task.aggregate([
        { $group: { _id: "$status", count: { $sum: 1 } } },
      ]),
      Task.aggregate([
        { $group: { _id: "$priority", count: { $sum: 1 } } },
      ]),
    ]);

  const statusCountsObj = statusCounts.reduce((acc, s) => {
    acc[s._id] = s.count;
    return acc;
  }, {});

  const priorityCountsObj = priorityCounts.reduce((acc, p) => {
    acc[p._id] = p.count;
    return acc;
  }, {});

  const completionPercent =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return res.json({
    totals: {
      total,
      pending,
      submitted,
      completed,
      overdue,
    },
    completionPercent,
    statusCounts: {
      pending: statusCountsObj.pending || 0,
      submitted: statusCountsObj.submitted || 0,
      completed: statusCountsObj.completed || 0,
    },
    priorityCounts: {
      low: priorityCountsObj.low || 0,
      medium: priorityCountsObj.medium || 0,
      high: priorityCountsObj.high || 0,
    },
  });
};
