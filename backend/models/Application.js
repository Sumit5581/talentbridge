const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    resumeUrl: { type: String, required: true },
    coverNote: { type: String },
    status: {
      type: String,
      enum: [
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Interviewed",
        "Offered",
        "Rejected",
        "Hired",
      ],
      default: "Applied",
    },
    interview: {
      scheduledAt: { type: Date },
      mode: { type: String, enum: ["Online", "In-Person", "Phone"], default: "Online" },
      link: { type: String },
      notes: { type: String },
    },
    feedback: { type: String },
  },
  { timestamps: true }
);

// prevent duplicate applications by the same candidate to the same job
applicationSchema.index({ job: 1, candidate: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
