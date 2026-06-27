import React from "react";
import { Route, Routes } from "react-router-dom";
import MyJobs from "./MyJobs";
import PostJob from "./PostJob";
import Applicants from "./Applicants";

const EmployerDashboard = () => {
  return (
    <Routes>
      <Route index element={<MyJobs />} />
      <Route path="post" element={<PostJob />} />
      <Route path="applicants/:jobId" element={<Applicants />} />
    </Routes>
  );
};

export default EmployerDashboard;
