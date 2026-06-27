import React from "react";
import { NavLink, Route, Routes } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import JobBrowse from "./JobBrowse";
import Profile from "./Profile";
import MyApplications from "./MyApplications";

const tabClass = ({ isActive }) =>
  `px-4 py-2 text-sm font-medium rounded-md ${
    isActive ? "bg-brand-600 text-white" : "text-slate-600 hover:bg-slate-100"
  }`;

const CandidateDashboard = () => {
  const { user } = useAuth();

  return (
    <div>
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 pt-6">
          <h1 className="text-xl font-semibold text-slate-800">
            Welcome, {user?.name?.split(" ")[0]} 👋
          </h1>
          <div className="flex gap-2 mt-4">
            <NavLink to="" end className={tabClass}>
              Browse Jobs
            </NavLink>
            <NavLink to="applications" className={tabClass}>
              My Applications
            </NavLink>
            <NavLink to="profile" className={tabClass}>
              Profile & Resume
            </NavLink>
          </div>
        </div>
      </div>

      <Routes>
        <Route index element={<JobBrowse />} />
        <Route path="applications" element={<MyApplications />} />
        <Route path="profile" element={<Profile />} />
      </Routes>
    </div>
  );
};

export default CandidateDashboard;
