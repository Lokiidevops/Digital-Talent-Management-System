require("dotenv").config({ path: "./.env" });
const mongoose = require("mongoose");
const User = require("./models/User");

const seedSuperAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB...");

        const exists = await User.findOne({ role: "superadmin" });
        if (exists) {
            console.log("Super Admin already exists:", exists.email);
            process.exit(0);
        }

        const superAdmin = await User.create({
            name: "Super Administrator",
            email: "superadmin@dtms.com",
            password: "SuperSecretPassword123!",
            role: "superadmin",
            isApproved: true,
            isVerified: true
        });

        console.log("Super Admin created successfully!");
        console.log("Email: superadmin@dtms.com");
        console.log("Password: SuperSecretPassword123!");
        process.exit(0);
    } catch (err) {
        console.error("Seeding failed:", err);
        process.exit(1);
    }
};

seedSuperAdmin();
