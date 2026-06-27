const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["candidate", "employer", "hr", "admin"],
      default: "candidate",
    },
    phone: { type: String },
    company: { type: String }, // for employer role
    designation: { type: String },

    // Candidate-specific fields
    skills: [{ type: String }],
    education: { type: String },
    experienceYears: { type: Number, default: 0 },
    resumeUrl: { type: String }, // path to uploaded resume
    resumeOriginalName: { type: String },

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
