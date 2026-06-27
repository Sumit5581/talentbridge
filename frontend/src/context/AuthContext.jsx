import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";
import { io } from "socket.io-client";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("tb_token");
    if (token) {
      api
        .get("/auth/me")
        .then((res) => setUser(res.data))
        .catch(() => {
          localStorage.removeItem("tb_token");
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user) {
      const socketUrl = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";
      const s = io(socketUrl, { transports: ["websocket"] });
      s.emit("join", user._id);
      setSocket(s);
      return () => s.disconnect();
    }
  }, [user]);

  const login = async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("tb_token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const register = async (payload) => {
    const res = await api.post("/auth/register", payload);
    localStorage.setItem("tb_token", res.data.token);
    setUser(res.data);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem("tb_token");
    setUser(null);
    if (socket) socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, socket }}>
      {children}
    </AuthContext.Provider>
  );
};
