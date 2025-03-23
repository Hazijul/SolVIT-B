import mongoose from "mongoose";

const TravelPlanSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // Store user ID for personalized plans
    destination: { type: String, required: true },
    days: { type: Number, required: true },
    notes: { type: String },
    plan: { type: String, required: true }, // Store the generated AI plan as HTML
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.models.TravelPlan || mongoose.model("TravelPlan", TravelPlanSchema);
