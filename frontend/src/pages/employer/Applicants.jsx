import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

const statusOptions = [
  "Applied",
  "Shortlisted",
  "Interview Scheduled",
  "Interviewed",
  "Offered",
  "Rejected",
  "Hired",
];

const Applicants = () => {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);
  const [schedulingId, setSchedulingId] = useState(null);
  const [interviewForm, setInterviewForm] = useState({ scheduledAt: "", mode: "Online", link: "" });

  const apiBase = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace("/api", "");

  const fetchApplicants = async () => {
    const res = await api.get(`/applications/job/${jobId}`);
    setApplications(res.data);
  };

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const updateStatus = async (id, status) => {
    const res = await api.put(`/applications/${id}/status`, { status });
    setApplications((prev) => prev.map((a) => (a._id === id ? { ...a, status: res.data.status } : a)));
  };

  const submitInterview = async (id) => {
    const res = await api.put(`/applications/${id}/interview`, interviewForm);
    setApplications((prev) =>
      prev.map((a) => (a._id === id ? { ...a, status: res.data.status, interview: res.data.interview } : a))
    );
    setSchedulingId(null);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Applicants</h1>

      <div className="space-y-4">
        {applications.length === 0 && (
          <p className="text-slate-500 text-sm">No applicants yet for this job.</p>
        )}
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{app.candidate?.name}</h3>
                <p className="text-sm text-slate-500">{app.candidate?.email} • {app.candidate?.phone}</p>
                <p className="text-sm text-slate-500 mt-1">
                  {app.candidate?.education} • {app.candidate?.experienceYears} yrs experience
                </p>
                {app.candidate?.skills?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {app.candidate.skills.map((s) => (
                      <span key={s} className="text-xs bg-brand-50 text-brand-700 px-2 py-1 rounded-md">
                        {s}
                      </span>
                    ))}
                  </div>
                )}
              </div>
              <a
                href={`${apiBase}${app.resumeUrl}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-brand-600 underline whitespace-nowrap"
              >
                View Resume
              </a>
            </div>

            {app.coverNote && (
              <p className="text-sm text-slate-600 mt-3 italic">"{app.coverNote}"</p>
            )}

            <div className="flex items-center gap-3 mt-4 flex-wrap">
              <select
                value={app.status}
                onChange={(e) => updateStatus(app._id, e.target.value)}
                className="text-sm border border-slate-300 rounded-md px-3 py-1.5"
              >
                {statusOptions.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>

              <button
                onClick={() => setSchedulingId(schedulingId === app._id ? null : app._id)}
                className="text-sm bg-amber-50 text-amber-700 px-3 py-1.5 rounded-md hover:bg-amber-100"
              >
                {app.interview?.scheduledAt ? "Reschedule Interview" : "Schedule Interview"}
              </button>
            </div>

            {app.interview?.scheduledAt && schedulingId !== app._id && (
              <p className="text-sm text-slate-500 mt-2">
                📅 Scheduled: {new Date(app.interview.scheduledAt).toLocaleString()} ({app.interview.mode})
              </p>
            )}

            {schedulingId === app._id && (
              <div className="mt-4 bg-slate-50 p-4 rounded-md space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="datetime-local"
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                    onChange={(e) =>
                      setInterviewForm({ ...interviewForm, scheduledAt: e.target.value })
                    }
                  />
                  <select
                    className="border border-slate-300 rounded-md px-3 py-2 text-sm"
                    value={interviewForm.mode}
                    onChange={(e) => setInterviewForm({ ...interviewForm, mode: e.target.value })}
                  >
                    <option>Online</option>
                    <option>In-Person</option>
                    <option>Phone</option>
                  </select>
                </div>
                <input
                  placeholder="Meeting link (if online)"
                  className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm"
                  onChange={(e) => setInterviewForm({ ...interviewForm, link: e.target.value })}
                />
                <button
                  onClick={() => submitInterview(app._id)}
                  className="bg-brand-600 text-white text-sm px-4 py-2 rounded-md hover:bg-brand-700"
                >
                  Confirm Schedule
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Applicants;
