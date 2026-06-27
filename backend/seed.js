// Run with: npm run seed
// Creates demo accounts and sample jobs so the app isn't empty for a demo.
require("dotenv").config();
const connectDB = require("./config/db");
const User = require("./models/User");
const Job = require("./models/Job");
const Application = require("./models/Application");
const Notification = require("./models/Notification");

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Job.deleteMany({}),
    Application.deleteMany({}),
    Notification.deleteMany({}),
  ]);

  const admin = await User.create({
    name: "Admin User",
    email: "admin@talentbridge.com",
    password: "Admin@123",
    role: "admin",
  });

  const hr = await User.create({
    name: "Swasti Mishra",
    email: "hr@talentbridge.com",
    password: "Hr@12345",
    role: "hr",
    designation: "HR Manager",
  });

  const employer = await User.create({
    name: "Aarsh AI Technologies",
    email: "employer@talentbridge.com",
    password: "Employer@123",
    role: "employer",
    company: "Aarsh AI Technologies",
  });

  const candidate = await User.create({
    name: "Sumit Kumar",
    email: "candidate@talentbridge.com",
    password: "Candidate@123",
    role: "candidate",
    skills: ["React", "Node.js", "MongoDB", "Express"],
    education: "B.Tech, Cloud Computing and Automation",
    experienceYears: 0,
  });

  const job1 = await Job.create({
    title: "Full Stack Developer Intern",
    company: "Aarsh AI Technologies",
    location: "Remote",
    jobType: "Internship",
    description: "Work on the MERN stack building real recruitment tools.",
    requiredSkills: ["React", "Node.js", "MongoDB"],
    minExperience: 0,
    salaryRange: "₹10,000 - ₹15,000/month",
    postedBy: employer._id,
  });

  const job2 = await Job.create({
    title: "Frontend Developer",
    company: "Aarsh AI Technologies",
    location: "Bhopal, India",
    jobType: "Full-Time",
    description: "Build performant, accessible React interfaces.",
    requiredSkills: ["React", "Tailwind CSS", "JavaScript"],
    minExperience: 1,
    salaryRange: "₹4,00,000 - ₹6,00,000/year",
    postedBy: employer._id,
  });

  await Application.create({
    job: job1._id,
    candidate: candidate._id,
    resumeUrl: "/uploads/resumes/sample-resume.pdf",
    coverNote: "Excited to apply my MERN stack skills here!",
    status: "Shortlisted",
  });

  console.log("Seed data created successfully:");
  console.log("Admin login:     admin@talentbridge.com / Admin@123");
  console.log("HR login:        hr@talentbridge.com / Hr@12345");
  console.log("Employer login:  employer@talentbridge.com / Employer@123");
  console.log("Candidate login: candidate@talentbridge.com / Candidate@123");

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
