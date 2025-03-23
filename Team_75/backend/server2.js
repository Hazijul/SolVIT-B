import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import civicRoutes from "./controllers/civicController.js";
import userDetailRoutes from "./routes/userDetailsRoutes.js";
import civicIssueRoutes from "./routes/civicIssueRoute.js";
import Priority from "./routes/priorityRoutes.js";

dotenv.config();
const app = express();
const PORT = 5000;

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.error("MongoDB connection failed:", error));

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173", methods: ["GET", "POST"], credentials: true }));
app.use("/uploads", express.static("uploads"));  // Serve uploaded files

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userDetailRoutes);
app.use("/api/issues", civicIssueRoutes);
app.use("/api/civic", civicRoutes);
app.use("/api/priority", Priority);
app.get("/", (req, res) => res.send("API is running 🚀"));

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
