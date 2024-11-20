import React, { useState } from "react";
import Login from "./login"; // Login component for authentication
import PatientForm from "./PatientForm"; // Patient form component
import HealthNotes from "./HealthNotes"; // Health notes component
import PatientHistory from "./PatientHistory"; // Patient history component
import "./App.css"; // App-specific styles
import "./login.css"; // Login-specific styles
import './Navbar.css';

const App = () => {
  const [user, setUser] = useState(null); // Manage user login state
  const [activeTab, setActiveTab] = useState("form"); // Manage active tab state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  const handleLogin = (userData) => {
    setUser(userData); // Save logged-in user data
  };

  const handleLogout = () => {
    setUser(null); // Clear user data to log out
    setActiveTab("form"); // Reset to default tab
  };

  // Handle Search Query Change
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  // Render Login Page if the user is not logged in
  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div>
      {/* App Header */}
      <header className="app-header">
        <h1>Welcome, {user.username}</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </header>

      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-links">
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
        </div>

        {/* Search Bar */}
        <div className="search-bar-container">
          <input
            type="text"
            placeholder="Search patients..."
            value={searchQuery}
            onChange={handleSearch}
            className="search-bar"
          />
          <button className="search-btn">Search</button>
        </div>
      </nav>

      {/* Display Active Tab Content */}
      <div className="content">
        {activeTab === "form" && <PatientForm />}
        {activeTab === "healthNotes" && <HealthNotes />}
        {activeTab === "history" && <PatientHistory searchQuery={searchQuery} />}
      </div>
    </div>
  );
};

export default App;
