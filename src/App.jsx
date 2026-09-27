import React, { useState } from "react";
import Dashboard from "./components/Dashboard";
import MainForm from "./components/MainForm";

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem("vault_user");
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("vault_user", JSON.stringify(userData));
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("vault_user");
    setUser(null);
  };

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return <MainForm onLoginSuccess={handleLoginSuccess} />;
}
