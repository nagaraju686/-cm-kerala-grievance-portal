
import express from "express";
import jwt from "jsonwebtoken";
import { GoogleGenAI } from "@google/genai";
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
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};

// AI COMPLAINT ANALYSIS
router.post("/analyze", verifyCMO, async (req, res) => {
  try {
    const { subject, description } = req.body;

    if (!subject || !description) {
      return res.status(400).json({
        success: false,
        message: "Subject and description are required"
      });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "Gemini API key is missing"
      });
    }

    const departments = await Department.find({
      isActive: true
    }).select("name");

    const departmentNames = departments.map(
      department => department.name
    );

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY
    });

    const prompt = `
You are an AI assistant for a public grievance portal.

Analyze the following complaint.

Subject: ${subject}

Description: ${description}

Available departments:
${departmentNames.join(", ")}

Return only valid JSON in this exact format:

{
  "category": "Complaint category",
  "department": "One available department name",
  "priority": "Low, Medium or High",
  "summary": "Short summary of the complaint"
}

Rules:
1. Select the most suitable department from the available list.
2. Priority must be Low, Medium or High.
3. Do not invent facts.
4. Keep the summary short.
5. These are suggestions only. A human CMO administrator must review them.
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.2,
        maxOutputTokens: 500
      }
    });

    const analysis = JSON.parse(response.text);

    const allowedPriorities = ["Low", "Medium", "High"];

    if (
      !analysis.category ||
      !analysis.department ||
      !allowedPriorities.includes(analysis.priority) ||
      !analysis.summary
    ) {
      throw new Error("AI returned an invalid analysis");
    }

    res.json({
      success: true,
      message: "AI analysis completed",
      humanReviewRequired: true,
      analysis
    });

  } catch (error) {
    console.log("AI Analysis Error:", error.message);

    res.status(500).json({
      success: false,
      message: "AI analysis failed. Please try again."
    });
  }
});

export default router;
