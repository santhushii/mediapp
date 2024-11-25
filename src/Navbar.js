import React, { useState } from "react";
import "./Navbar.css"; // Add your navbar-specific styles

const Navbar = ({ activeTab, setActiveTab, onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // Trigger search on input change
  };

  return (
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
      <input
        type="text"
        placeholder="Search..."
        value={query}
        onChange={handleSearchChange}
        className="search-bar"
      />
    </nav>
  );
};

export default Navbar;
