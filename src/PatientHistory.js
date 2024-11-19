import React, { useEffect, useState } from "react";
import "./App.css"; // Ensure this file includes required styles

const PatientHistory = () => {
  const [currentPatient, setCurrentPatient] = useState(null); // Current patient details
  const [history, setHistory] = useState([]); // List of reviewed patients
  const [error, setError] = useState(null);

  // Fetch all reviewed patient history
  const fetchHistory = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-patients");
      if (!response.ok) throw new Error("Failed to fetch patient history");

      const data = await response.json();
      setHistory(data); // Set reviewed patients
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

      if (data.error) {
        setCurrentPatient(null); // No current patient
      } else {
        setCurrentPatient(data); // Set current patient
      }
    } catch (err) {
      console.error("Error fetching current patient:", err.message);
      setError(err.message);
    }
  };

  // Handle "Delete Patient" button click
  const deletePatient = async (id) => {
    if (!window.confirm("Are you sure you want to delete this patient?")) return;

    try {
      const response = await fetch(`http://localhost:3001/delete-patient/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        alert("Patient deleted successfully!");
        // Refresh the history after deletion
        fetchHistory();
      } else {
        const responseData = await response.json();
        alert(`Failed to delete patient: ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error deleting patient:", error.message);
      alert("An error occurred while deleting the patient.");
    }
  };

  // Handle "Mark as Reviewed" button click
  const markAsReviewed = async (id) => {
    try {
      const response = await fetch("http://localhost:3001/mark-reviewed", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        alert("Patient marked as reviewed!");
        // Refresh current patient and history
        fetchCurrentPatient();
        fetchHistory();
      } else {
        const responseData = await response.json();
        alert(`Failed to mark patient as reviewed: ${responseData.error || "Unknown error"}`);
      }
    } catch (error) {
      console.error("Error marking as reviewed:", error.message);
      alert("An error occurred while marking the patient as reviewed.");
    }
  };

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
          {currentPatient.profileImage && (
            <img
              src={currentPatient.profileImage}
              alt="Profile"
              className="profile-image"
            />
          )}
          <p><strong>NIC:</strong> {currentPatient.NIC}</p>
          <p><strong>Name:</strong> {currentPatient.name}</p>
          <p><strong>Age:</strong> {currentPatient.age}</p>
          <p><strong>Sex:</strong> {currentPatient.sex}</p>
          <p><strong>Contact:</strong> {currentPatient.contact}</p>
          <p><strong>BMI:</strong> {currentPatient.bmi}</p>
          <p><strong>Allergies:</strong> {currentPatient.allergies}</p>
          <p><strong>Special Notes:</strong> {currentPatient.specialNotes}</p>
          <button
            className="mark-reviewed-btn"
            onClick={() => markAsReviewed(currentPatient.id)}
          >
            Mark as Reviewed
          </button>
        </div>
      ) : (
        <p>No current patient details available.</p>
      )}

      {/* Reviewed Patients History */}
      {history.length > 0 ? (
        <div className="history-section">
          <h3>Reviewed Patients</h3>
          <table className="history-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>NIC</th>
                <th>Name</th>
                <th>Age</th>
                <th>Sex</th>
                <th>Contact</th>
                <th>BMI</th>
                <th>Allergies</th>
                <th>Special Notes</th>
                <th>Actions</th> {/* Add an Actions column */}
              </tr>
            </thead>
            <tbody>
              {history.map((record) => (
                <tr key={record.id}>
                  <td>{record.id}</td>
                  <td>{record.NIC}</td>
                  <td>{record.name}</td>
                  <td>{record.age}</td>
                  <td>{record.sex}</td>
                  <td>{record.contact}</td>
                  <td>{record.bmi}</td>
                  <td>{record.allergies}</td>
                  <td>{record.specialNotes}</td>
                  <td>
                    <button
                      className="delete-btn"
                      onClick={() => deletePatient(record.id)}
                    >
                      Delete
                    </button>
                  </td> {/* Add delete button */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No reviewed patient history available.</p>
      )}
    </div>
  );
};

export default PatientHistory;
