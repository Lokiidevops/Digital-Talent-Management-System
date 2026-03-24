require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();
connectDB();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/auth", require("./routes/forgotRoutes"));

app.get("/", (req, res) => res.json({ message: "API running" }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const taskRoutes = require("./routes/taskRoutes");

app.use("/api/tasks", taskRoutes);
