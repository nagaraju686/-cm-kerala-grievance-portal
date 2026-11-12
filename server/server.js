
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import grievanceRoutes from "./routes/grievanceRoutes.js";
import departmentRoutes from "./routes/departmentRoutes.js";
import assignmentRoutes from "./routes/assignmentRoutes.js";
import officerRoutes from "./routes/officerRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import cmoRoutes from "./routes/cmoRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173"
}));

app.use(express.json());

// Make uploaded files accessible
app.use("/uploads", express.static("uploads"));

// Test routes
app.get("/", (req, res) => {
  res.send("CM Kerala Backend Running Successfully");
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to CM Kerala Portal API"
  });
});

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/grievances", grievanceRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/cmo", cmoRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/uploads", uploadRoutes);

// Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.log("Server startup failed:", error.message);
  }
};

startServer();
