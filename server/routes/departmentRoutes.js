
import express from "express";
import jwt from "jsonwebtoken";
import Department from "../models/Department.js";

const router = express.Router();

// Verify CMO Admin
const verifyCMO = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "cmo") {
      return res.status(403).json({
        success: false,
        message: "CMO Admin access only"
      });
    }

    req.user = decoded;
    next();

  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Get All Departments
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find({ isActive: true });

    res.json({
      success: true,
      departments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Add New Department (CMO only)
router.post("/", verifyCMO, async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Department name is required"
      });
    }

    const existing = await Department.findOne({ name });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Department already exists"
      });
    }

    const department = await Department.create({
      name,
      description
    });

    res.status(201).json({
      success: true,
      message: "Department added successfully",
      department
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
