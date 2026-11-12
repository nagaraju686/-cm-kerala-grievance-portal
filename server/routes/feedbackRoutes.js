
import express from "express";
import jwt from "jsonwebtoken";

import Feedback from "../models/Feedback.js";
import Grievance from "../models/Grievance.js";

const router = express.Router();

// Verify Citizen Login
const verifyCitizen = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Please login first"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "citizen") {
      return res.status(403).json({
        success: false,
        message: "Citizen access only"
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

// SUBMIT FEEDBACK
router.post("/:grievanceId", verifyCitizen, async (req, res) => {
  try {
    const { rating, comment } = req.body;

    if (!rating || !Number.isInteger(Number(rating)) ||
        Number(rating) < 1 || Number(rating) > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5"
      });
    }

    const grievance = await Grievance.findOne({
      _id: req.params.grievanceId,
      citizen: req.user.id
    });

    if (!grievance) {
      return res.status(404).json({
        success: false,
        message: "Grievance not found"
      });
    }

    if (grievance.status !== "Resolved") {
      return res.status(400).json({
        success: false,
        message: "Feedback is available only after resolution"
      });
    }

    const existingFeedback = await Feedback.findOne({
      grievance: grievance._id,
      citizen: req.user.id
    });

    if (existingFeedback) {
      return res.status(400).json({
        success: false,
        message: "Feedback already submitted"
      });
    }

    const feedback = await Feedback.create({
      grievance: grievance._id,
      citizen: req.user.id,
      rating: Number(rating),
      comment: comment || ""
    });

    res.status(201).json({
      success: true,
      message: "Feedback submitted successfully",
      feedback
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
