import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = ["#3b5bdb", "#22c55e", "#f59e0b", "#ef4444", "#a855f7", "#06b6d4", "#84cc16"];

const HRDashboard = () => {
  const [stats, setStats] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    api.get("/analytics/overview").then((res) => setStats(res.data));
    api.get("/applications").then((res) => setApplications(res.data));
  }, []);

  if (!stats) return <div className="p-10 text-center text-slate-500">Loading dashboard...</div>;

  const statusData = stats.statusBreakdown.map((s) => ({ name: s._id, value: s.count }));
  const topJobsData = stats.topJobsByApplicants.map((j) => ({
    name: j.title.length > 18 ? j.title.slice(0, 18) + "..." : j.title,
    applicants: j.applicantsCount,
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">HR Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Candidates", value: stats.totalCandidates },
          { label: "Employers", value: stats.totalEmployers },
          { label: "Total Jobs", value: stats.totalJobs },
          { label: "Open Jobs", value: stats.openJobs },
          { label: "Applications", value: stats.totalApplications },
        ].map((s) => (
          <div key={s.label} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 text-center">
            <p className="text-2xl font-bold text-brand-600">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Applications by Status</h3>
          {statusData.length === 0 ? (
            <p className="text-sm text-slate-400">No application data yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={statusData} dataKey="value" nameKey="name" outerRadius={90} label>
                  {statusData.map((entry, i) => (
                    <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">Top Jobs by Applicants</h3>
          {topJobsData.length === 0 ? (
            <p className="text-sm text-slate-400">No jobs posted yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topJobsData}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="applicants" fill="#3b5bdb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 className="font-semibold text-slate-700 mb-4">All Applications (Tracking Overview)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2 pr-4">Candidate</th>
                <th className="py-2 pr-4">Job</th>
                <th className="py-2 pr-4">Company</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Applied On</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((app) => (
                <tr key={app._id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{app.candidate?.name}</td>
                  <td className="py-2 pr-4">{app.job?.title}</td>
                  <td className="py-2 pr-4">{app.job?.company}</td>
                  <td className="py-2 pr-4">{app.status}</td>
                  <td className="py-2 pr-4">{new Date(app.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {applications.length === 0 && (
            <p className="text-sm text-slate-400 py-4">No applications yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HRDashboard;
