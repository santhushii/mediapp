import React, { useState } from "react";
import PatientForm from "./PatientForm";
import PatientHistory from "./PatientHistory";
import "./App.css"; // Make sure to have this file for styling

const App = () => {
  const [activeTab, setActiveTab] = useState("form");

  return (
    <div>
      {/* Navigation Bar */}
      <nav className="navbar">
        <button
          className={activeTab === "form" ? "active" : ""}
          onClick={() => setActiveTab("form")}
        >
          Patient Form
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
        {activeTab === "history" && <PatientHistory />}
      </div>
    </div>
  );
};

export default App;
