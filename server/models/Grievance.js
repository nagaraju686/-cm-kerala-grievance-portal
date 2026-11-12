
import mongoose from "mongoose";

const grievanceSchema = new mongoose.Schema({
  referenceId: {
    type: String,
    unique: true
  },
  citizen: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  district: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    enum: ["Low", "Medium", "High"],
    default: "Medium"
  },
  status: {
    type: String,
    enum: [
      "Submitted",
      "Under Review",
      "In Progress",
      "Resolved",
      "Reopened"
    ],
    default: "Submitted"
  },
  department: {
    type: String,
    default: "Not Assigned"
  }
}, { timestamps: true });

const Grievance = mongoose.model("Grievance", grievanceSchema);

export default Grievance;
