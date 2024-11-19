import React, { useState } from "react";
import PatientForm from "./PatientForm";
import HealthNotes from "./HealthNotes";
import PatientHistory from "./PatientHistory";
import "./App.css";

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
