
import express from "express";
import jwt from "jsonwebtoken";

import Grievance from "../models/Grievance.js";
import GrievanceHistory from "../models/GrievanceHistory.js";
import User from "../models/user.js";
import Assignment from "../models/Assignment.js";
import Attachment from "../models/Attachment.js";

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

// CMO DASHBOARD STATISTICS
router.get("/dashboard", verifyCMO, async (req, res) => {
  try {
    const total = await Grievance.countDocuments();
    const submitted = await Grievance.countDocuments({ status: "Submitted" });
    const underReview = await Grievance.countDocuments({ status: "Under Review" });
    const inProgress = await Grievance.countDocuments({ status: "In Progress" });
    const resolved = await Grievance.countDocuments({ status: "Resolved" });
    const reopened = await Grievance.countDocuments({ status: "Reopened" });

    res.json({
      success: true,
      statistics: {
        total,
        submitted,
        underReview,
        inProgress,
        resolved,
        reopened
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VIEW ALL GRIEVANCES WITH ATTACHMENTS
router.get("/grievances", verifyCMO, async (req, res) => {
  try {
    const { district, category, status, priority } = req.query;
    const filter = {};

    if (district) filter.district = district;
    if (category) filter.category = category;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const grievances = await Grievance.find(filter)
      .populate("citizen", "name email mobile")
      .sort({ createdAt: -1 })
      .lean();

    const grievanceIds = grievances.map(g => g._id);

    const attachments = await Attachment.find({
      grievance: { $in: grievanceIds }
    }).lean();

    const result = grievances.map(grievance => ({
      ...grievance,
      attachments: attachments.filter(
        attachment =>
          String(attachment.grievance) === String(grievance._id)
      )
    }));

    res.json({
      success: true,
      count: result.length,
      grievances: result
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VIEW GRIEVANCE HISTORY
router.get("/history/:grievanceId", verifyCMO, async (req, res) => {
  try {
    const grievance = await Grievance.findById(req.params.grievanceId);

    if (!grievance) {
      return res.status(404).json({
        message: "Grievance not found"
      });
    }

    const history = await GrievanceHistory.find({
      grievance: grievance._id
    })
      .populate("updatedBy", "name email role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      referenceId: grievance.referenceId,
      currentStatus: grievance.status,
      history
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET ALL OFFICERS
router.get("/officers", verifyCMO, async (req, res) => {
  try {
    const officers = await User.find(
      { role: "officer" },
      "name email mobile"
    );

    res.json({
      success: true,
      officers
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// VIEW ALL ACTION TAKEN REPORTS
router.get("/reports", verifyCMO, async (req, res) => {
  try {
    const assignments = await Assignment.find({
      reportStatus: { $in: ["Submitted", "Reviewed"] }
    })
      .populate("grievance")
      .populate("department", "name")
      .populate("officer", "name email")
      .sort({ reportSubmittedAt: -1 });

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

// REVIEW ACTION TAKEN REPORT
router.put("/review-report/:assignmentId", verifyCMO, async (req, res) => {
  try {
    const assignment = await Assignment.findById(
      req.params.assignmentId
    );

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: "Assignment not found"
      });
    }

    if (assignment.reportStatus !== "Submitted") {
      return res.status(400).json({
        success: false,
        message: "No pending report available for review"
      });
    }

    assignment.reportStatus = "Reviewed";
    await assignment.save();

    await GrievanceHistory.create({
      grievance: assignment.grievance,
      status: "In Progress",
      remarks: "CMO reviewed the officer action taken report",
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: "Action Taken Report reviewed successfully",
      assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// RESOLVE GRIEVANCE AFTER REPORT REVIEW
router.put("/resolve/:grievanceId", verifyCMO, async (req, res) => {
  try {
    const grievance = await Grievance.findById(
      req.params.grievanceId
    );

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found"
      });
    }

    const assignment = await Assignment.findOne({
      grievance: grievance._id
    }).sort({ updatedAt: -1 });

    if (!assignment || assignment.reportStatus !== "Reviewed") {
      return res.status(400).json({
        success: false,
        message: "Officer report must be reviewed before resolving"
      });
    }

    grievance.status = "Resolved";
    await grievance.save();

    await GrievanceHistory.create({
      grievance: grievance._id,
      status: "Resolved",
      remarks: "CMO reviewed the report and resolved the grievance",
      updatedBy: req.user.id
    });

    res.json({
      success: true,
      message: "Grievance resolved successfully",
      grievance
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
