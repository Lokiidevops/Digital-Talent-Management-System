const path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });
const mongoose = require("mongoose");
const Task = require("./models/Task");
const Notification = require("./models/Notification");

const clearTasks = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB...");
        
        const taskResult = await Task.deleteMany({});
        console.log(`Deleted ${taskResult.deletedCount} tasks.`);
        
        const notifyResult = await Notification.deleteMany({});
        console.log(`Deleted ${notifyResult.deletedCount} notifications.`);

        console.log("Environment reset successful!");
        process.exit(0);
    } catch (err) {
        console.error("Failed to clear DB:", err);
        process.exit(1);
    }
};

clearTasks();
