import React from "react";
import "./Navbar.css";

const Navbar = ({ activeTab, setActiveTab, onLogout }) => {
  return (
    <div className="navbar">
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
          />
          <button className="search-btn">Search</button>
        </div>
      </div>
      <button onClick={onLogout} className="logout-btn">
        Logout
      </button>
    </div>
  );
};

export default Navbar;
