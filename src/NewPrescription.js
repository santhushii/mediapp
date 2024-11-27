import React, { useState, useEffect } from "react";
import "./App.css";

const NewPrescription = ({ searchQuery }) => {
  const [newPrescriptions, setNewPrescriptions] = useState([]);
  const [filteredNewPrescriptions, setFilteredNewPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    pressureLevel: "",
    sugarLevel: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch existing New Prescriptions on component load
  useEffect(() => {
    fetchNewPrescriptions();
  }, []);

  // Update filtered list whenever `newPrescriptions` or `searchQuery` changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNewPrescriptions(newPrescriptions);
    } else {
      const filtered = newPrescriptions.filter(
        (note) =>
          note.patientId
            .toString()
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          note.pressureLevel
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          note.sugarLevel
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          (note.notes && note.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNewPrescriptions(filtered);
    }
  }, [searchQuery, newPrescriptions]);

  const fetchNewPrescriptions = async () => {
    try {
      const response = await fetch("http://localhost:3001/new-prescription");
      if (response.ok) {
        const data = await response.json();
        setNewPrescriptions(data);
        setFilteredNewPrescriptions(data); // Initialize filtered data
      } else {
        console.error("Failed to fetch New Prescriptions");
      }
    } catch (error) {
      console.error("Error fetching New Prescriptions:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.patientId) {
      newErrors.patientId = "Patient ID is required.";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.patientId)) {
      newErrors.patientId = "Patient ID must contain only letters and numbers.";
    }
    if (!formData.pressureLevel) {
      newErrors.pressureLevel = "Pressure level is required.";
    } else if (!/^[0-9./-]+$/.test(formData.pressureLevel)) {
      newErrors.pressureLevel =
        "Pressure level must contain only numbers and symbols.";
    }
    if (!formData.sugarLevel) {
      newErrors.sugarLevel = "Sugar level is required.";
    } else if (!/^[a-zA-Z0-9]+$/.test(formData.sugarLevel)) {
      newErrors.sugarLevel = "Sugar level must contain only letters and numbers.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch(
          "http://localhost:3001/submit-new-prescription",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
          }
        );
        if (response.ok) {
          setSuccessMessage("New prescription added successfully!");
          setFormData({
            patientId: "",
            pressureLevel: "",
            sugarLevel: "",
            notes: "",
          });
          fetchNewPrescriptions(); // Refresh the list
        } else {
          console.error("Failed to save New prescription");
        }
      } catch (error) {
        console.error("Error saving New prescription:", error);
      }
    }
  };

  return (
    <div className="new-prescription-container">
      <h2>New Prescription</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="new-prescription-form">
        <div className="form-group">
          <label>Patient ID:</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleInputChange}
          />
          {errors.patientId && <p className="error">{errors.patientId}</p>}
        </div>
        <div className="form-group">
          <label>Pressure Level:</label>
          <input
            type="text"
            name="pressureLevel"
            value={formData.pressureLevel}
            onChange={handleInputChange}
          />
          {errors.pressureLevel && <p className="error">{errors.pressureLevel}</p>}
        </div>
        <div className="form-group">
          <label>Sugar Level:</label>
          <input
            type="text"
            name="sugarLevel"
            value={formData.sugarLevel}
            onChange={handleInputChange}
          />
          {errors.sugarLevel && <p className="error">{errors.sugarLevel}</p>}
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Add New Prescription
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>

      {/* Display Section */}
      <h3>Recorded New Prescriptions</h3>
      {filteredNewPrescriptions.length > 0 ? (
        <div className="card-container">
          {filteredNewPrescriptions.map((note) => (
            <div className="card" key={note.id}>
              <h4>Patient ID: {note.patientId}</h4>
              <p>
                <strong>Pressure Level:</strong> {note.pressureLevel}
              </p>
              <p>
                <strong>Sugar Level:</strong> {note.sugarLevel}
              </p>
              <p>
                <strong>Notes:</strong> {note.notes}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p>No matching New Prescriptions recorded yet.</p>
      )}
    </div>
  );
};

export default NewPrescription;
