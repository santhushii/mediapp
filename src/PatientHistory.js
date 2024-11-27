import React, { useEffect, useState } from "react";
import "./App.css"; // Ensure this file includes required styles

const PatientHistory = ({ searchQuery }) => {
  const [currentPatient, setCurrentPatient] = useState(null); // Current patient details
  const [history, setHistory] = useState([]); // List of reviewed patients
  const [filteredHistory, setFilteredHistory] = useState([]); // Filtered list for search
  const [error, setError] = useState(null);

  // Fetch all reviewed patient history
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-patients");
      if (!response.ok) throw new Error("Failed to fetch patient history");

      const data = await response.json();
      setHistory(data); // Set reviewed patients
      setFilteredHistory(data); // Initialize filtered data
    } catch (err) {
      console.error("Error fetching patient history:", err.message);
      setError(err.message);
    }
  };

  // Fetch current patient details
  const fetchCurrentPatient = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-current-patient");
      if (!response.ok) throw new Error("Failed to fetch current patient");

      const data = await response.json();
      setCurrentPatient(data.error ? null : data); // Set current patient or null
    } catch (err) {
      console.error("Error fetching current patient:", err.message);
      setError(err.message);
    }
  };

  // Filter results based on searchQuery
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredHistory(history);
    } else {
      const filtered = history.filter(
        (patient) =>
          patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.NIC.toLowerCase().includes(searchQuery.toLowerCase()) ||
          patient.contact.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredHistory(filtered);
    }
  }, [searchQuery, history]);

  useEffect(() => {
    fetchCurrentPatient();
    fetchHistory();
  }, []);

  if (error) {
    return <p className="error-message">Error: {error}</p>;
  }

  return (
    <div className="patient-history-container">
      <h2>Patient History</h2>

      {/* Current Patient Section */}
      {currentPatient ? (
        <div className="current-card">
        <h3>Current Patient</h3>
        <div className="patient-card">
          <h4>{currentPatient.name}</h4>
          {currentPatient.profileImage && (
            <img
              src={currentPatient.profileImage}
              alt="Profile"
              className="profile-image"
            />
          )}
          <p><strong>NIC:</strong> {currentPatient.NIC}</p>
          <p><strong>Age:</strong> {currentPatient.age}</p>
          <p><strong>gender:</strong> {currentPatient.gender}</p>
          <p><strong>Contact:</strong> {currentPatient.contact}</p>
          <p><strong>BMI:</strong> {currentPatient.bmi}</p>
          <p><strong>Allergies:</strong> {currentPatient.allergies}</p>
          <p><strong>Special Notes:</strong> {currentPatient.specialNotes}</p>
          <button
            className="retrieve-btn"
            onClick={() => console.log('Retrieve Button Clicked')} // Replace with actual logic
          >
            Retrieve
          </button>
        </div>
      </div>
      
      ) : (
        <p>No current patient details available.</p>
      )}

      {/* Reviewed Patients History */}
      {filteredHistory.length > 0 ? (
        <div className="card-container">
          {filteredHistory.map((record) => (
            <div className="card" key={record.id}>
              <h4>{record.name}</h4>
              <p><strong>NIC:</strong> {record.NIC}</p>
              <p><strong>Age:</strong> {record.age}</p>
              <p><strong>gender:</strong> {record.gender}</p>
              <p><strong>Contact:</strong> {record.contact}</p>
              <p><strong>BMI:</strong> {record.bmi}</p>
              <p><strong>Allergies:</strong> {record.allergies}</p>
              <p><strong>Special Notes:</strong> {record.specialNotes}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching patient history available.</p>
      )}
    </div>
  );
};

export default PatientHistory;
