
import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  grievance: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Grievance",
    required: true
  },
  fileName: {
    type: String,
    required: true
  },
  filePath: {
    type: String,
    required: true
  },
  fileType: {
    type: String
  }
}, { timestamps: true });

const Attachment = mongoose.model("Attachment", attachmentSchema);

export default Attachment;
