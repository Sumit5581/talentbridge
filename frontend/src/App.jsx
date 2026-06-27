import React from "react";
import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/candidate/CandidateDashboard";
import EmployerDashboard from "./pages/employer/EmployerDashboard";
import HRDashboard from "./pages/hr/HRDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute allowedRoles={["candidate"]}>
              <CandidateDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/employer/*"
          element={
            <ProtectedRoute allowedRoles={["employer", "hr", "admin"]}>
              <EmployerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/*"
          element={
            <ProtectedRoute allowedRoles={["hr", "admin"]}>
              <HRDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default App;
