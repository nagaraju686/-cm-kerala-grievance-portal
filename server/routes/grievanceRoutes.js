
import express from "express";
import jwt from "jsonwebtoken";
import Grievance from "../models/Grievance.js";
import GrievanceHistory from "../models/GrievanceHistory.js";

const router = express.Router();

// Verify Login Token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// Submit New Grievance
router.post("/submit", verifyToken, async (req, res) => {
  try {
    const { district, category, subject, description } = req.body;

    if (!district || !category || !subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill all complaint details"
      });
    }

    const referenceId = "CMK" + Date.now();

    const grievance = await Grievance.create({
      referenceId,
      citizen: req.user.id,
      district,
      category,
      subject,
      description,
      status: "Submitted"
    });

    // Save initial grievance history
    await GrievanceHistory.create({
      grievance: grievance._id,
      status: "Submitted",
      remarks: "Grievance submitted successfully by citizen",
      updatedBy: req.user.id
    });

    res.status(201).json({
      success: true,
      message: "Grievance submitted successfully",
      grievance
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Get Citizen Grievances
router.get("/my-grievances", verifyToken, async (req, res) => {
  try {
    const grievances = await Grievance.find({
      citizen: req.user.id
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      grievances
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

// Track Grievance Using Reference ID
router.get("/track/:referenceId", async (req, res) => {
  try {
    const grievance = await Grievance.findOne({
      referenceId: req.params.referenceId
    });

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found"
      });
    }

    // Get complete status history
    const history = await GrievanceHistory.find({
      grievance: grievance._id
    })
      .populate("updatedBy", "name role")
      .sort({ createdAt: 1 });

    res.json({
      success: true,
      grievance,
      history
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
