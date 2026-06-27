import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PostJob = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: user?.company || "",
    location: "",
    jobType: "Full-Time",
    description: "",
    requiredSkills: "",
    minExperience: 0,
    salaryRange: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      await api.post("/jobs", {
        ...form,
        requiredSkills: form.requiredSkills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      navigate("..");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to post job");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Post a New Job</h1>

      {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md mb-4">{error}</div>}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <div>
          <label className="text-sm font-medium text-slate-600">Job Title</label>
          <input
            required
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Company</label>
          <input
            required
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.company}
            onChange={(e) => setForm({ ...form, company: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Location</label>
            <input
              required
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Job Type</label>
            <select
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
              value={form.jobType}
              onChange={(e) => setForm({ ...form, jobType: e.target.value })}
            >
              {["Full-Time", "Part-Time", "Internship", "Contract", "Remote"].map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Description</label>
          <textarea
            required
            rows={4}
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Required Skills (comma separated)</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.requiredSkills}
            onChange={(e) => setForm({ ...form, requiredSkills: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-slate-600">Min Experience (years)</label>
            <input
              type="number"
              min="0"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
              value={form.minExperience}
              onChange={(e) => setForm({ ...form, minExperience: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-600">Salary Range</label>
            <input
              placeholder="e.g. ₹4,00,000 - ₹6,00,000/year"
              className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
              value={form.salaryRange}
              onChange={(e) => setForm({ ...form, salaryRange: e.target.value })}
            />
          </div>
        </div>
        <button
          disabled={saving}
          className="bg-brand-600 text-white px-5 py-2.5 rounded-md text-sm hover:bg-brand-700 disabled:opacity-60"
        >
          {saving ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
