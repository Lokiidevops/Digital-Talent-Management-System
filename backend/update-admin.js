require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

const updateAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB...");

        const user = await User.findOne({ email: /lokeshrohit234/i });
        if (!user) {
            console.log("User not found: lokeshrohit234@gmail.com");
        } else {
            user.role = "admin";
            user.isApproved = true;
            user.isVerified = true;
            await user.save();
            console.log("Successfully updated to ADMIN:", user.email);
        }
        process.exit(0);
    } catch (err) {
        console.error("Update failed:", err);
        process.exit(1);
    }
};

updateAdmin();
