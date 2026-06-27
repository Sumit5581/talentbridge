import React, { useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    education: user?.education || "",
    experienceYears: user?.experienceYears || 0,
    skills: (user?.skills || []).join(", "),
  });
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      const res = await api.put("/users/profile", {
        ...form,
        skills: form.skills.split(",").map((s) => s.trim()).filter(Boolean),
      });
      setUser((prev) => ({ ...prev, ...res.data }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    if (!file) return setMessage("Please choose a file first.");
    const formData = new FormData();
    formData.append("resume", file);
    setSaving(true);
    setMessage("");
    try {
      const res = await api.post("/users/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser((prev) => ({ ...prev, ...res.data.user }));
      setMessage("Resume uploaded successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Resume upload failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

      {message && (
        <div className="bg-brand-50 text-brand-700 text-sm p-3 rounded-md mb-4">{message}</div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 mb-6">
        <h2 className="font-semibold text-slate-700 mb-4">Resume</h2>
        {user?.resumeUrl ? (
          <p className="text-sm text-slate-600 mb-3">
            Current resume:{" "}
            <a
              href={`${apiBase}${user.resumeUrl}`}
              target="_blank"
              rel="noreferrer"
              className="text-brand-600 underline"
            >
              {user.resumeOriginalName || "View resume"}
            </a>
          </p>
        ) : (
          <p className="text-sm text-slate-500 mb-3">No resume uploaded yet.</p>
        )}
        <form onSubmit={handleResumeUpload} className="flex items-center gap-3">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setFile(e.target.files[0])}
            className="text-sm"
          />
          <button
            disabled={saving}
            className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-700 disabled:opacity-60"
          >
            Upload
          </button>
        </form>
      </div>

      <form onSubmit={handleProfileSave} className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 space-y-4">
        <h2 className="font-semibold text-slate-700">Profile Details</h2>
        <div>
          <label className="text-sm font-medium text-slate-600">Name</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Phone</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Education</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.education}
            onChange={(e) => setForm({ ...form, education: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Experience (years)</label>
          <input
            type="number"
            min="0"
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.experienceYears}
            onChange={(e) => setForm({ ...form, experienceYears: e.target.value })}
          />
        </div>
        <div>
          <label className="text-sm font-medium text-slate-600">Skills (comma separated)</label>
          <input
            className="mt-1 w-full border border-slate-300 rounded-md px-3 py-2"
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
          />
        </div>
        <button
          disabled={saving}
          className="bg-slate-800 text-white px-5 py-2.5 rounded-md text-sm hover:bg-slate-900 disabled:opacity-60"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </form>
    </div>
  );
};

export default Profile;
