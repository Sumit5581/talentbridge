import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const statusColors = {
  Applied: "bg-slate-100 text-slate-700",
  Shortlisted: "bg-blue-50 text-blue-700",
  "Interview Scheduled": "bg-amber-50 text-amber-700",
  Interviewed: "bg-purple-50 text-purple-700",
  Offered: "bg-green-50 text-green-700",
  Rejected: "bg-red-50 text-red-700",
  Hired: "bg-emerald-100 text-emerald-800",
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/applications/mine").then((res) => setApplications(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Applications</h1>
      <div className="space-y-4">
        {applications.length === 0 && (
          <p className="text-slate-500 text-sm">You haven't applied to any jobs yet.</p>
        )}
        {applications.map((app) => (
          <div key={app._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-slate-800">{app.job?.title}</h3>
                <p className="text-sm text-slate-500">
                  {app.job?.company} • {app.job?.location}
                </p>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-md font-medium ${
                  statusColors[app.status] || "bg-slate-100 text-slate-600"
                }`}
              >
                {app.status}
              </span>
            </div>
            {app.interview?.scheduledAt && (
              <div className="mt-3 text-sm bg-amber-50 text-amber-800 p-3 rounded-md">
                📅 Interview scheduled: {new Date(app.interview.scheduledAt).toLocaleString()}{" "}
                ({app.interview.mode})
                {app.interview.link && (
                  <>
                    {" "}
                    —{" "}
                    <a href={app.interview.link} target="_blank" rel="noreferrer" className="underline">
                      Join link
                    </a>
                  </>
                )}
              </div>
            )}
            {app.feedback && (
              <p className="text-sm text-slate-500 mt-2">Feedback: {app.feedback}</p>
            )}
            <p className="text-xs text-slate-400 mt-2">
              Applied on {new Date(app.createdAt).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyApplications;
