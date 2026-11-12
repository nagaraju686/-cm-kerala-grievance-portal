
import express from "express";
import jwt from "jsonwebtoken";

import Grievance from "../models/Grievance.js";
import Department from "../models/Department.js";
import Assignment from "../models/Assignment.js";
import User from "../models/user.js";
import GrievanceHistory from "../models/GrievanceHistory.js";

const router = express.Router();

// VERIFY CMO ADMIN
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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// ASSIGN GRIEVANCE TO OFFICER
router.post("/", verifyCMO, async (req, res) => {
  try {
    const { grievanceId, departmentId, officerId, remarks } = req.body;

    if (!grievanceId || !departmentId || !officerId) {
      return res.status(400).json({
        success: false,
        message: "Grievance, department and officer are required"
      });
    }

    const grievance = await Grievance.findById(grievanceId);

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found"
      });
    }

    const department = await Department.findById(departmentId);

    if (!department || !department.isActive) {
      return res.status(404).json({
        success: false,
        message: "Active department not found"
      });
    }

    const officer = await User.findOne({
      _id: officerId,
      role: "officer"
    });

    if (!officer) {
      return res.status(404).json({
        success: false,
        message: "Officer not found"
      });
    }

    const assignment = await Assignment.create({
      grievance: grievance._id,
      department: department._id,
      officer: officer._id,
      assignedBy: req.user.id,
      remarks: remarks || ""
    });

    grievance.department = department.name;
    grievance.status = "In Progress";
    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      status: "In Progress",
      remarks: remarks || `Assigned to ${department.name} and ${officer.name}`,
      updatedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Grievance assigned successfully",
      assignment
    });

  } catch (error) {
    console.log("Assignment Error:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
