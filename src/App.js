import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./login";
import AddNewPatient from "./AddNewPatient";
import NewPrescription from "./NewPrescription";
import PatientHistory from "./PatientHistory";
import ForgotPassword from "./ForgotPassword";

import "./App.css";
import "./login.css";
import "./Navbar.css";

const App = () => {
  const [user, setUser] = useState(null); // Manage user login state
  const [registeredUsers, setRegisteredUsers] = useState([]); // Mock user database
  const [activeTab, setActiveTab] = useState("form"); // Manage active tab state
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Login handler
  const handleLogin = (userData) => {
    const isRegistered = registeredUsers.find(
      (user) => user.email === userData.email
    );
    if (isRegistered) {
      console.log("Logging in user:", userData);
      setUser(userData); // Save logged-in user data
    } else {
      alert("You need to sign up before logging in.");
    }
  };

  // Signup handler
  const handleSignup = (userData) => {
    const isAlreadyRegistered = registeredUsers.find(
      (user) => user.email === userData.email
    );
    if (isAlreadyRegistered) {
      alert("This email is already registered. Please log in.");
    } else {
      setRegisteredUsers([...registeredUsers, userData]); // Add user to the database
      console.log("Signup successful for user:", userData);
      setUser(userData); // Log the user in
    }
  };

  // Search input handler
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
                onSignup={handleSignup}
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
                  {/* Navigation Bar */}
                  <nav className="navbar">
                    <div className="nav-links">
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
                    <div className="action-container">
                      <button
                        className="add-new-btn"
                        onClick={() => setActiveTab("form")}
                      >
                        <span>+</span> Add New Patient
                      </button>
                      <div className="search-bar-container">
                        <input
                          type="text"
                          className="search-bar"
                          placeholder="Search patients... (Name, ID, etc.)"
                          value={searchQuery}
                          onChange={handleSearch}
                        />
                        <button className="search-btn">Search</button>
                      </div>
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
                  onSignup={handleSignup}
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
