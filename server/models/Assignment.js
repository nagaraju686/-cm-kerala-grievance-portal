
import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
  {
    grievance: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Grievance",
      required: true
    },

    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
      required: true
    },

    officer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    remarks: {
      type: String,
      default: ""
    },

    actionTakenReport: {
      type: String,
      default: ""
    },

    reportSubmittedAt: {
      type: Date,
      default: null
    },

    reportStatus: {
      type: String,
      enum: ["Pending", "Submitted", "Reviewed"],
      default: "Pending"
    }
  },
  { timestamps: true }
);

const Assignment =
  mongoose.models.Assignment ||
  mongoose.model("Assignment", assignmentSchema);

export default Assignment;
