import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./login";
import AddNewPatient from "./AddNewPatient";
import NewPrescription from "./NewPrescription";
import PatientHistory from "./PatientHistory";
import ForgotPassword from "./ForgotPassword";
import Navbar from "./Navbar"; // Import Navbar component

import "./App.css";
import "./login.css";
import "./Navbar.css";

const App = () => {
  const [user, setUser] = useState(null); // Manage user login state
  const [activeTab, setActiveTab] = useState("form"); // Default active tab is Add New Patient
  const [searchQuery, setSearchQuery] = useState(""); // Search query state

  // Check if token exists in localStorage on initial load
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("http://localhost:3001/user-details", {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error("Error fetching user details:", data.error);
            setUser(null); // Clear user if token is invalid
          } else {
            setUser(data); // Set user details
          }
        })
        .catch((err) => {
          console.error("Error:", err);
          setUser(null); // Clear user on error
        });
    }
  }, []);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear token
    setUser(null); // Reset user state
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
              user ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          {/* Forgot Password Page */}
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              user ? (
                <div>
                  {/* Navbar */}
                  <Navbar
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                    onLogout={handleLogout}
                    searchQuery={searchQuery}
                    handleSearch={handleSearch}
                  />

                  {/* Tab Content */}
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
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
