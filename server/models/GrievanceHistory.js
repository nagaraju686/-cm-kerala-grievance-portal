
import mongoose from "mongoose";

const historySchema = new mongoose.Schema({
  grievance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grievance",
    required: true
  },
  status: {
    type: String,
    required: true
  },
  remarks: {
    type: String
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
}, { timestamps: true });

const GrievanceHistory = mongoose.model(
  "GrievanceHistory",
  historySchema
);

export default GrievanceHistory;
