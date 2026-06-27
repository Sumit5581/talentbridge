import React, { useEffect, useState } from "react";
import api from "../../api/axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [roleFilter, setRoleFilter] = useState("");

  useEffect(() => {
    api.get("/analytics/overview").then((res) => setStats(res.data));
  }, []);

  useEffect(() => {
    api.get("/users", { params: roleFilter ? { role: roleFilter } : {} }).then((res) =>
      setUsers(res.data)
    );
  }, [roleFilter]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Admin Dashboard</h1>

      {stats && (
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
      )}

      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-slate-700">User Management</h3>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="text-sm border border-slate-300 rounded-md px-3 py-1.5"
          >
            <option value="">All Roles</option>
            <option value="candidate">Candidates</option>
            <option value="employer">Employers</option>
            <option value="hr">HR</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500 border-b">
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Role</th>
                <th className="py-2 pr-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-100">
                  <td className="py-2 pr-4">{u.name}</td>
                  <td className="py-2 pr-4">{u.email}</td>
                  <td className="py-2 pr-4 capitalize">{u.role}</td>
                  <td className="py-2 pr-4">{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-sm text-slate-400 py-4">No users found.</p>}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
