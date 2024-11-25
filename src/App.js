import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // React Router components
import Login from "./login"; // Login component
import AddNewPatient from "./AddNewPatient"; // Add New Patient component
import NewPrescription from "./NewPrescription"; // New Prescription component
import PatientHistory from "./PatientHistory"; // Patient history component
import ForgotPassword from "./ForgotPassword"; // Forgot password component

import "./App.css"; // App-specific styles
import "./login.css"; // Login-specific styles
import "./Navbar.css"; // Navbar-specific styles


const App = () => {
  const [user, setUser] = useState(null); // Manage user login state
  const [activeTab, setActiveTab] = useState("form"); // Manage active tab state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Login handler
  const handleLogin = (userData) => {
    setUser(userData); // Save logged-in user data
  };

  // Logout handler
  const handleLogout = () => {
    setUser(null); // Clear user data to log out
    setActiveTab("form"); // Reset to default tab
  };

  // Search input handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value); // Update search query state
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login Page */}
          <Route
            path="/"
            element={
              <Login
                onLogin={handleLogin}
                onSignup={() => console.log("Signup handler")}
                onForgotPassword={() => console.log("Forgot Password handler")}
              />
            }
          />
          {/* Forgot Password Page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard (after login) */}
          <Route
            path="/dashboard"
            element={
              user ? (
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
                        Add New Patient
                      </button>
                      <button
                        className={activeTab === "NewPrescription" ? "active" : ""}
                        onClick={() => setActiveTab("NewPrescription")}
                      >
                        New Prescription
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
                        placeholder="Search patients... (Name, ID, etc.)"
                        value={searchQuery}
                        onChange={handleSearch}
                        className="search-bar"
                      />
                      <button className="search-btn">Search</button>
                    </div>
                  </nav>

                  {/* Display Active Tab Content */}
                  <div className="content">
                    {activeTab === "form" && <AddNewPatient />}
                    {activeTab === "NewPrescription" && (
                      <NewPrescription searchQuery={searchQuery} />
                    )}
                    {activeTab === "history" && (
                      <PatientHistory searchQuery={searchQuery} />
                    )}
                  </div>
                </div>
              ) : (
                <Login
                  onLogin={handleLogin}
                  onSignup={() => console.log("Signup handler")}
                  onForgotPassword={() => console.log("Forgot Password handler")}
                />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
