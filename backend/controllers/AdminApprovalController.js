const User = require("../models/User");
const EmailService = require("../services/EmailService");

// List all unapproved admins
exports.getPendingAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin", isApproved: false, isVerified: true }).select("-password");
        res.json(admins);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

// Approve or Reject Admin
exports.approveAdmin = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body; // 'active' or 'rejected'

    try {
        const user = await User.findById(id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (status === "active") {
            user.isApproved = true;
            await user.save();
            await EmailService.sendApprovalEmail(user.email, "active");
            res.json({ message: "Admin approved and notified!" });
        } else {
            // Optionally delete or mark as rejected
            await User.findByIdAndDelete(id);
            await EmailService.sendApprovalEmail(user.email, "rejected");
            res.json({ message: "Admin application rejected." });
        }
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
