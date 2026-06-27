const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const { protect, authorize } = require("../middleware/auth");

// GET /api/analytics/overview - hr/admin dashboard stats
router.get("/overview", protect, authorize("hr", "admin"), async (req, res) => {
  try {
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const totalEmployers = await User.countDocuments({ role: "employer" });
    const totalJobs = await Job.countDocuments();
    const openJobs = await Job.countDocuments({ status: "Open" });
    const totalApplications = await Application.countDocuments();

    const statusBreakdown = await Application.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    const topJobsByApplicants = await Job.find()
      .sort({ applicantsCount: -1 })
      .limit(5)
      .select("title company applicantsCount");

    const applicationsOverTime = await Application.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      { $limit: 30 },
    ]);

    res.json({
      totalCandidates,
      totalEmployers,
      totalJobs,
      openJobs,
      totalApplications,
      statusBreakdown,
      topJobsByApplicants,
      applicationsOverTime,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
