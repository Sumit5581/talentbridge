import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 text-center">
      <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
        Welcome to <span className="text-brand-600">TalentBridge</span>
      </h1>
      <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-8">
        A full-stack Job Portal & Recruitment Management System — connecting
        candidates, employers, and HR teams in one place.
      </p>

      {!user && (
        <div className="flex gap-4 justify-center">
          <Link
            to="/register"
            className="bg-brand-600 text-white px-6 py-3 rounded-md font-medium hover:bg-brand-700"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="bg-white border border-slate-300 px-6 py-3 rounded-md font-medium hover:bg-slate-50"
          >
            Log In
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-16 text-left">
        {[
          { title: "Candidate Portal", desc: "Build your profile, upload your resume, and apply to jobs in a click." },
          { title: "Employer Portal", desc: "Post jobs and track applicants through every stage of hiring." },
          { title: "HR Dashboard", desc: "Oversee all postings, applications, and interview scheduling." },
          { title: "Analytics", desc: "Real-time insights into hiring funnels and candidate pipelines." },
        ].map((card) => (
          <div key={card.title} className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
            <h3 className="font-semibold text-slate-700 mb-2">{card.title}</h3>
            <p className="text-sm text-slate-500">{card.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
