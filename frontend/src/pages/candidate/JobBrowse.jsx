import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";

const JobBrowse = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [appliedIds, setAppliedIds] = useState([]);
  const [message, setMessage] = useState("");

  const fetchJobs = async () => {
    const res = await api.get("/jobs", { params: { search } });
    setJobs(res.data);
  };

  const fetchMyApplications = async () => {
    const res = await api.get("/applications/mine");
    setAppliedIds(res.data.map((a) => a.job?._id));
  };

  useEffect(() => {
    fetchJobs();
    fetchMyApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleApply = async (jobId) => {
    setMessage("");
    if (!user?.resumeUrl) {
      setMessage("Please upload your resume in your Profile before applying.");
      return;
    }
    try {
      await api.post("/applications", { jobId });
      setAppliedIds((prev) => [...prev, jobId]);
      setMessage("Applied successfully!");
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to apply");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-4">Browse Jobs</h1>

      <div className="flex gap-2 mb-6">
        <input
          placeholder="Search by title, company, or skill..."
          className="flex-1 border border-slate-300 rounded-md px-3 py-2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchJobs()}
        />
        <button
          onClick={fetchJobs}
          className="bg-brand-600 text-white px-4 py-2 rounded-md hover:bg-brand-700"
        >
          Search
        </button>
      </div>

      {message && (
        <div className="bg-brand-50 text-brand-700 text-sm p-3 rounded-md mb-4">{message}</div>
      )}

      <div className="space-y-4">
        {jobs.length === 0 && (
          <p className="text-slate-500 text-sm">No jobs found. Try a different search.</p>
        )}
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{job.title}</h3>
                <p className="text-sm text-slate-500">
                  {job.company} • {job.location} • {job.jobType}
                </p>
              </div>
              <span className="text-xs bg-slate-100 px-2 py-1 rounded-md text-slate-600">
                {job.applicantsCount} applicants
              </span>
            </div>
            <p className="text-sm text-slate-600 mt-3">{job.description}</p>
            {job.requiredSkills?.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {job.requiredSkills.map((s) => (
                  <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-md">
                    {s}
                  </span>
                ))}
              </div>
            )}
            {job.salaryRange && (
              <p className="text-sm text-slate-500 mt-2">💰 {job.salaryRange}</p>
            )}
            <button
              disabled={appliedIds.includes(job._id)}
              onClick={() => handleApply(job._id)}
              className="mt-4 bg-slate-800 text-white text-sm px-4 py-2 rounded-md hover:bg-slate-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {appliedIds.includes(job._id) ? "Applied" : "Apply Now"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JobBrowse;
