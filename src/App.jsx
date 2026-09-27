import { useState } from "react";
import Dashboard from "./components/Dashboard";
import MainForm from "./components/MainForm";
// ... other imports

export default function App() {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem("vault_user");
    return cached ? JSON.parse(cached) : null;
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

  // Otherwise render your existing Auth Screen
  return (
    // Your Auth component JSX with handleLoginSuccess attached to your login response
    <MainForm onLoginSuccess={handleLoginSuccess} />
  );
}
