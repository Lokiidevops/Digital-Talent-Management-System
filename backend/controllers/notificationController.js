const Notification = require("../models/Notification");

// Get notifications for a user
exports.getNotifications = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      console.warn("getNotifications: Unauthorized access attempt or missing user ID");
      return res.status(401).json({ message: "Unauthorized: Missing user info" });
    }

    // Explicitly use the ID to ensure query consistency
    const userId = req.user._id;
    
    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .limit(50);
      
    // Always return an array, even if empty
    return res.json(notifications || []);
  } catch (err) {
    console.error("CRITICAL: getNotifications Error:", err);
    return res.status(500).json({ 
      message: "An internal server error occurred while fetching notifications",
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Mark a single notification as read
exports.markAsRead = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    const notification = await Notification.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { isRead: true },
      { new: true }
    );
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    return res.json(notification);
  } catch (err) {
    console.error("markAsRead error:", err);
    return res.status(500).json({ message: "Failed to mark as read" });
  }
};

// Mark all notifications as read for current user
exports.markAllAsRead = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });
    await Notification.updateMany({ userId: req.user._id }, { isRead: true });
    return res.json({ message: "All notifications marked as read" });
  } catch (err) {
    console.error("markAllAsRead error:", err);
    return res.status(500).json({ message: "Failed to update notifications" });
  }
};
