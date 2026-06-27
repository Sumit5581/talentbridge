const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const { protect, authorize } = require("../middleware/auth");

const notifyUser = async (req, userId, message, type, link) => {
  const note = await Notification.create({ user: userId, message, type, link });
  const io = req.app.get("io");
  if (io) io.to(userId.toString()).emit("notification", note);
};

// POST /api/applications - candidate applies to a job
router.post("/", protect, authorize("candidate"), async (req, res) => {
  try {
    const { jobId, coverNote } = req.body;

    if (!req.user.resumeUrl) {
      return res.status(400).json({
        message: "Please upload your resume before applying to jobs",
      });
    }

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: "Job not found" });

    const application = await Application.create({
      job: jobId,
      candidate: req.user.id,
      resumeUrl: req.user.resumeUrl,
      coverNote,
    });

    job.applicantsCount += 1;
    await job.save();

    await notifyUser(
      req,
      job.postedBy,
      `${req.user.name} applied for ${job.title}`,
      "application",
      `/employer/applicants/${job._id}`
    );

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: "You have already applied to this job" });
    }
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/mine - candidate's own applications
router.get("/mine", protect, authorize("candidate"), async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.user.id })
      .populate("job", "title company location jobType status")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/applications/job/:jobId - employer/hr/admin: applicants for a job
router.get(
  "/job/:jobId",
  protect,
  authorize("employer", "hr", "admin"),
  async (req, res) => {
    try {
      const applications = await Application.find({ job: req.params.jobId })
        .populate("candidate", "name email phone skills education experienceYears resumeUrl")
        .sort({ createdAt: -1 });
      res.json(applications);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/applications - hr/admin: all applications (applicant tracking overview)
router.get("/", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("candidate", "name email")
      .populate("job", "title company")
      .sort({ createdAt: -1 });
    res.json(applications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/applications/:id/status - update application status
router.put(
  "/:id/status",
  protect,
  authorize("employer", "hr", "admin"),
  async (req, res) => {
    try {
      const { status, feedback } = req.body;
      const application = await Application.findById(req.params.id).populate("job");
      if (!application) return res.status(404).json({ message: "Application not found" });

      application.status = status || application.status;
      if (feedback !== undefined) application.feedback = feedback;
      await application.save();

      await notifyUser(
        req,
        application.candidate,
        `Your application for ${application.job.title} is now: ${application.status}`,
        "status",
        `/candidate/applications`
      );

      res.json(application);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// PUT /api/applications/:id/interview - schedule interview
router.put(
  "/:id/interview",
  protect,
  authorize("employer", "hr", "admin"),
  async (req, res) => {
    try {
      const { scheduledAt, mode, link, notes } = req.body;
      const application = await Application.findById(req.params.id).populate("job");
      if (!application) return res.status(404).json({ message: "Application not found" });

      application.interview = { scheduledAt, mode, link, notes };
      application.status = "Interview Scheduled";
      await application.save();

      await notifyUser(
        req,
        application.candidate,
        `Interview scheduled for ${application.job.title} on ${new Date(
          scheduledAt
        ).toLocaleString()}`,
        "interview",
        `/candidate/applications`
      );

      res.json(application);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

module.exports = router;
