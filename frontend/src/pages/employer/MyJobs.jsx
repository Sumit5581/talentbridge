import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { Link } from "react-router-dom";

const MyJobs = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    api.get("/jobs/employer/mine").then((res) => setJobs(res.data));
  }, []);

  const toggleStatus = async (job) => {
    const newStatus = job.status === "Open" ? "Closed" : "Open";
    const res = await api.put(`/jobs/${job._id}`, { status: newStatus });
    setJobs((prev) => prev.map((j) => (j._id === job._id ? res.data : j)));
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">My Job Postings</h1>
        <Link
          to="post"
          className="bg-brand-600 text-white px-4 py-2 rounded-md text-sm hover:bg-brand-700"
        >
          + Post New Job
        </Link>
      </div>

      <div className="space-y-4">
        {jobs.length === 0 && (
          <p className="text-slate-500 text-sm">You haven't posted any jobs yet.</p>
        )}
        {jobs.map((job) => (
          <div key={job._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{job.title}</h3>
                <p className="text-sm text-slate-500">
                  {job.location} • {job.jobType}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  job.status === "Open" ? "bg-green-50 text-green-700" : "bg-slate-100 text-slate-500"
                }`}
              >
                {job.status}
              </span>
            </div>
            <div className="flex gap-3 mt-4">
              <Link
                to={`applicants/${job._id}`}
                className="text-sm bg-slate-800 text-white px-4 py-2 rounded-md hover:bg-slate-900"
              >
                View Applicants ({job.applicantsCount})
              </Link>
              <button
                onClick={() => toggleStatus(job)}
                className="text-sm bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200"
              >
                {job.status === "Open" ? "Close Job" : "Reopen Job"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyJobs;
