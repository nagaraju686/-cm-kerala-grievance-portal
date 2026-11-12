
import express from "express";
import ContactEnquiry from "../models/ContactEnquiry.js";

const router = express.Router();

// SUBMIT CONTACT ENQUIRY
router.post("/", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "Please fill all fields"
      });
    }

    const enquiry = await ContactEnquiry.create({
      name,
      email,
      subject,
      message
    });

    res.status(201).json({
      success: true,
      message: "Your enquiry submitted successfully",
      enquiry
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
});

export default router;
