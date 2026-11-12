
import express from "express";
import jwt from "jsonwebtoken";

import Assignment from "../models/Assignment.js";
import Grievance from "../models/Grievance.js";
import GrievanceHistory from "../models/GrievanceHistory.js";

const router = express.Router();

// VERIFY OFFICER
const verifyOfficer = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "officer") {
      return res.status(403).json({
        success: false,
        message: "Officer access only"
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

// GET ASSIGNED GRIEVANCES
router.get("/my-assignments", verifyOfficer, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      officer: req.user.id
    })
      .populate("grievance")
      .populate("department", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: assignments.length,
      assignments
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// UPDATE GRIEVANCE STATUS
router.put("/update-status/:grievanceId", verifyOfficer, async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const allowedStatuses = [
      "Under Review",
      "In Progress"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Officer can update to Under Review or In Progress only"
      });
    }

    const assignment = await Assignment.findOne({
      grievance: req.params.grievanceId,
      officer: req.user.id
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: "This grievance is not assigned to you"
      });
    }

    const grievance = await Grievance.findById(
      req.params.grievanceId
    );

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found"
      });
    }

    grievance.status = status;
    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      status,
      remarks: remarks || "Status updated by officer",
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: "Grievance status updated successfully",
      grievance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// SUBMIT ACTION TAKEN REPORT
router.post("/submit-report/:grievanceId", verifyOfficer, async (req, res) => {
  try {
    const { actionTakenReport } = req.body;

    if (!actionTakenReport || !actionTakenReport.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter action taken report"
      });
    }

    const assignment = await Assignment.findOne({
      grievance: req.params.grievanceId,
      officer: req.user.id
    });

    if (!assignment) {
      return res.status(403).json({
        success: false,
        message: "This grievance is not assigned to you"
      });
    }

    const grievance = await Grievance.findById(
      req.params.grievanceId
    );

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found"
      });
    }

    assignment.actionTakenReport = actionTakenReport.trim();
    assignment.reportSubmittedAt = new Date();
    assignment.reportStatus = "Submitted";

    await assignment.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      status: grievance.status,
      remarks: "Officer submitted an action taken report",
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: "Action taken report submitted successfully",
      assignment
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
