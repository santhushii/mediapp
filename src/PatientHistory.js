import React, { useEffect, useState } from "react";
import "./PatientHistory.css";

const PatientHistory = () => {
  const [currentPatient, setCurrentPatient] = useState(null); // Current patient
  const [patientHistory, setPatientHistory] = useState([]); // Patient history
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch current patient
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
      setError("Failed to fetch current patient");
    }
  };

  // Fetch patient history
  const fetchPatientHistory = async () => {
    try {
      const response = await fetch("http://localhost:3001/get-patients");
      if (!response.ok) throw new Error("Failed to fetch patient history");

      const data = await response.json();
      setPatientHistory(data); // Set patient history
    } catch (err) {
      console.error("Error fetching patient history:", err.message);
      setError("Failed to fetch patient history");
    }
  };

  // Add new patient
  const addNewPatient = async () => {
    try {
      if (currentPatient) {
        const response = await fetch("http://localhost:3001/mark-reviewed", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: currentPatient.id }),
        });

        if (!response.ok) throw new Error("Failed to mark patient as reviewed");

        await fetchCurrentPatient(); // Fetch new current patient
        await fetchPatientHistory(); // Refresh history
      }
    } catch (err) {
      console.error("Error adding new patient:", err.message);
      setError("Failed to add new patient");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      await fetchCurrentPatient();
      await fetchPatientHistory();
      setIsLoading(false);
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p className="error-message">{error}</p>;
  }

  return (
    <div className="patient-history-container">
      <h2>Patient History</h2>

      {/* Current Patient Section */}
      <div className="current-patient-section">
        <h3>Current Patient</h3>
        {currentPatient ? (
          <div className="patient-card centered-card">
            <img
              src={currentPatient.profileImage || "default-profile.png"}
              alt={currentPatient.name}
              className="patient-image"
            />
            <h4>{currentPatient.name}</h4>
            <p>
              <strong>NIC:</strong> {currentPatient.NIC}{" "}
              <strong>Age:</strong> {currentPatient.age}{" "}
              <strong>Gender:</strong> {currentPatient.gender}
            </p>
            <p>
              <strong>Contact:</strong> {currentPatient.contact}{" "}
              <strong>BMI:</strong> {currentPatient.bmi}{" "}
              <strong>Allergies:</strong> {currentPatient.allergies || "None"}
            </p>
            <p>
              <strong>Special Notes:</strong>{" "}
              {currentPatient.specialNotes || "None"}
            </p>
            <button className="add-patient-btn" onClick={addNewPatient}>
              Add New Patient
            </button>
          </div>
        ) : (
          <p>No current patient available. Add a new patient.</p>
        )}
      </div>

      {/* Patient History Section */}
      <div className="patient-history-section">
        <h3>Patient History</h3>
        {patientHistory.length > 0 ? (
          <div className="history-list">
            {patientHistory.map((patient, index) => (
              <div className="patient-card" key={index}>
                <img
                  src={patient.profileImage || "default-profile.png"}
                  alt={patient.name}
                  className="patient-image"
                />
                <h4>{patient.name}</h4>
                <p>
                  <strong>NIC:</strong> {patient.NIC}{" "}
                  <strong>Age:</strong> {patient.age}{" "}
                  <strong>Gender:</strong> {patient.gender}
                </p>
                <p>
                  <strong>Contact:</strong> {patient.contact}{" "}
                  <strong>BMI:</strong> {patient.bmi}{" "}
                  <strong>Allergies:</strong> {patient.allergies || "None"}
                </p>
                <p>
                  <strong>Special Notes:</strong>{" "}
                  {patient.specialNotes || "None"}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No patient history available.</p>
        )}
      </div>
    </div>
  );
};

export default PatientHistory;
