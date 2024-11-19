import React, { useState } from "react";
import Login from "./login"; // Ensure the file name matches exactly (case-sensitive)
import PatientForm from "./PatientForm";
import HealthNotes from "./HealthNotes";
import PatientHistory from "./PatientHistory";
import "./App.css";
import "./login.css";

const App = () => {
  const [user, setUser] = useState(null); // Manage user login state
  const [activeTab, setActiveTab] = useState("form"); // Manage active tab state

  const handleLogin = (userData) => {
    setUser(userData); // Save logged-in user data
  };

  // Render Login Page if user is not logged in
  if (!user) {
    return <Login onLogin={handleLogin} />; // Ensure the Login component is used correctly
  }

  return (
    <div>
      <header className="app-header">
        <h1>Welcome, {user.username}</h1>
        <button
          className="logout-btn"
          onClick={() => {
            setUser(null); // Clear user data to log out
            setActiveTab("form"); // Reset to default tab
          }}
        >
          Logout
        </button>
      </header>

      {/* Navigation Bar */}
      <nav className="navbar">
        <button
          className={activeTab === "form" ? "active" : ""}
          onClick={() => setActiveTab("form")}
        >
          Patient Form
        </button>
        <button
          className={activeTab === "healthNotes" ? "active" : ""}
          onClick={() => setActiveTab("healthNotes")}
        >
          Health Notes
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          Patient History
        </button>
      </nav>

      {/* Display Active Tab Content */}
      <div className="content">
        {activeTab === "form" && <PatientForm />}
        {activeTab === "healthNotes" && <HealthNotes />}
        {activeTab === "history" && <PatientHistory />}
      </div>
    </div>
  );
};

export default App;
