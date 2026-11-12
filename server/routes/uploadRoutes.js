
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";

import Grievance from "../models/Grievance.js";
import Attachment from "../models/Attachment.js";

const router = express.Router();

// Check login token
const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Login required"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

// Upload folder
const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File storage settings
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() + "-" + Math.round(Math.random() * 1e9) +
      path.extname(file.originalname).toLowerCase();

    cb(null, uniqueName);
  }
});

// Allow only images and PDF
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf"
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPG, PNG and PDF files are allowed"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

// Upload grievance attachment
router.post(
  "/:grievanceId",
  verifyToken,
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          message: "Please select a file"
        });
      }

      const grievance = await Grievance.findById(
        req.params.grievanceId
      );

      if (!grievance) {
        fs.unlinkSync(req.file.path);

        return res.status(404).json({
          message: "Grievance not found"
        });
      }

      if (
        grievance.citizen.toString() !== req.user.id ||
        req.user.role !== "citizen"
      ) {
        fs.unlinkSync(req.file.path);

        return res.status(403).json({
          message: "You cannot upload to this grievance"
        });
      }

      const attachment = await Attachment.create({
        grievance: grievance._id,
        fileName: req.file.originalname,
        filePath: "/uploads/" + req.file.filename,
        fileType: req.file.mimetype
      });

      res.status(201).json({
        success: true,
        message: "File uploaded successfully",
        attachment
      });

    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

// Handle upload errors
router.use((error, req, res, next) => {
  res.status(400).json({
    message: error.message
  });
});

export default router;
