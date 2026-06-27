const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { protect, authorize } = require("../middleware/auth");
const upload = require("../middleware/upload");

// PUT /api/users/profile - update candidate/employer profile
router.put("/profile", protect, async (req, res) => {
  try {
    const fields = [
      "name",
      "phone",
      "company",
      "designation",
      "skills",
      "education",
      "experienceYears",
    ];
    const updates = {};
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, {
      new: true,
    }).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/users/resume - upload/replace resume (candidate only)
router.post(
  "/resume",
  protect,
  authorize("candidate"),
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.user.id,
        {
          resumeUrl: `/uploads/resumes/${req.file.filename}`,
          resumeOriginalName: req.file.originalname,
        },
        { new: true }
      ).select("-password");

      res.json({ message: "Resume uploaded successfully", user });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
);

// GET /api/users - admin/hr: list all users (optionally filter by role)
router.get("/", protect, authorize("admin", "hr"), async (req, res) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
