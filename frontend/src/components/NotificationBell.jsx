import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

const NotificationBell = () => {
  const { socket } = useAuth();
  const [notes, setNotes] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchNotes = async () => {
    try {
      const res = await api.get("/notifications");
      setNotes(res.data);
    } catch (e) {
      // silently ignore if not logged in yet
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on("notification", (note) => {
      setNotes((prev) => [note, ...prev]);
    });
    return () => socket.off("notification");
  }, [socket]);

  const unreadCount = notes.filter((n) => !n.isRead).length;

  const markAllRead = async () => {
    await api.put("/notifications/read-all");
    setNotes((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-slate-100"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg border border-slate-200 max-h-96 overflow-y-auto z-50">
          <div className="flex justify-between items-center p-3 border-b">
            <span className="font-semibold text-slate-700">Notifications</span>
            <button onClick={markAllRead} className="text-xs text-brand-600 hover:underline">
              Mark all read
            </button>
          </div>
          {notes.length === 0 ? (
            <p className="p-4 text-sm text-slate-400">No notifications yet</p>
          ) : (
            notes.map((n) => (
              <div
                key={n._id}
                className={`p-3 text-sm border-b border-slate-100 ${
                  n.isRead ? "text-slate-500" : "text-slate-800 bg-brand-50"
                }`}
              >
                {n.message}
                <div className="text-xs text-slate-400 mt-1">
                  {new Date(n.createdAt).toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
