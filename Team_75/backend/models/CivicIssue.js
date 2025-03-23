import mongoose from "mongoose";

const civicIssueSchema = new mongoose.Schema({
  issue: { type: String, required: true },
  description: { type: String, required: true },
  file: { type: String }, // Store file path
  location: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("CivicIssue", civicIssueSchema);
    