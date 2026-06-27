import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import NotificationBell from "./NotificationBell";

const roleHome = {
  candidate: "/candidate",
  employer: "/employer",
  hr: "/hr",
  admin: "/admin",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-40">
      <Link to="/" className="text-xl font-bold text-brand-600">
        TalentBridge
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <>
            <Link
              to={roleHome[user.role] || "/"}
              className="text-sm font-medium text-slate-600 hover:text-brand-600"
            >
              Dashboard
            </Link>
            <NotificationBell />
            <span className="text-sm text-slate-500 hidden sm:inline">
              {user.name} ({user.role})
            </span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-sm bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-sm font-medium text-slate-600">
              Login
            </Link>
            <Link
              to="/register"
              className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-md hover:bg-brand-700"
            >
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
