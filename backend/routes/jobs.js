const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");

// GET /api/jobs - public list with optional search/filter
router.get("/", async (req, res) => {
  try {
    const { search, location, jobType, status } = req.query;
    const filter = {};
    if (status) filter.status = status;
    else filter.status = "Open";
    if (location) filter.location = { $regex: location, $options: "i" };
    if (jobType) filter.jobType = jobType;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { requiredSkills: { $regex: search, $options: "i" } },
      ];
    }

    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/:id
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/jobs - employer/hr/admin create job
router.post("/", protect, authorize("employer", "hr", "admin"), async (req, res) => {
  try {
    const job = await Job.create({ ...req.body, postedBy: req.user.id });

    // Notify all candidates of a new job posting (lightweight fan-out)
    const candidates = await User.find({ role: "candidate" }).select("_id");
    const notifications = candidates.map((c) => ({
      user: c._id,
      message: `New job posted: ${job.title} at ${job.company}`,
      type: "job",
      link: `/candidate/jobs/${job._id}`,
    }));
    if (notifications.length) await Notification.insertMany(notifications);

    const io = req.app.get("io");
    if (io) io.emit("newJob", job);

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/jobs/:id - update job (only owner, hr, or admin)
router.put("/:id", protect, authorize("employer", "hr", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (
      req.user.role === "employer" &&
      job.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "You can only edit your own job postings" });
    }

    Object.assign(job, req.body);
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/jobs/:id
router.delete("/:id", protect, authorize("employer", "hr", "admin"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    if (
      req.user.role === "employer" &&
      job.postedBy.toString() !== req.user.id
    ) {
      return res.status(403).json({ message: "You can only delete your own job postings" });
    }

    await job.deleteOne();
    res.json({ message: "Job deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/jobs/employer/mine - jobs posted by logged-in employer
router.get("/employer/mine", protect, authorize("employer", "hr", "admin"), async (req, res) => {
  try {
    const filter = req.user.role === "employer" ? { postedBy: req.user.id } : {};
    const jobs = await Job.find(filter).sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
