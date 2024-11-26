import React, { useState, useEffect } from "react";
import "./App.css";

const NewPrescription = ({ searchQuery }) => {
  const [NewPrescription, setNewPrescription] = useState([]);
  const [filteredNewPrescription, setFilteredNewPrescription] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    pressureLevel: "",
    sugarLevel: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch existing New Prescription on component load
  useEffect(() => {
    fetchNewPrescription();
  }, []);

  // Update filtered list whenever `NewPrescription` or `searchQuery` changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNewPrescription(NewPrescription);
    } else {
      const filtered = NewPrescription.filter(
        (note) =>
          note.patientId.toString().toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.pressureLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          note.sugarLevel.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (note.notes && note.notes.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredNewPrescription(filtered);
    }
  }, [searchQuery, NewPrescription]);

  const fetchNewPrescription = async () => {
    try {
      const response = await fetch("http://localhost:3001/new-prescription");
      if (response.ok) {
        const data = await response.json();
        setNewPrescription(data);
        setFilteredNewPrescription(data); // Initialize filtered data
      } else {
        console.error("Failed to fetch New Prescription");
      }
    } catch (error) {
      console.error("Error fetching New Prescription:", error);
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
    if (!formData.patientId) newErrors.patientId = "Patient ID is required.";
    if (!formData.pressureLevel) newErrors.pressureLevel = "Pressure level is required.";
    if (!formData.sugarLevel) newErrors.sugarLevel = "Sugar level is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:3001/submit-new-prescription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccessMessage("New prescription added successfully!");
          setFormData({
            patientId: "",
            pressureLevel: "",
            sugarLevel: "",
            notes: "",
          });
          fetchNewPrescription(); // Refresh the list
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
      {filteredNewPrescription.length > 0 ? (
        <div className="card-container">
          {filteredNewPrescription.map((note) => (
            <div className="card" key={note.id}>
              <h4>Patient ID: {note.patientId}</h4>
              <p><strong>Pressure Level:</strong> {note.pressureLevel}</p>
              <p><strong>Sugar Level:</strong> {note.sugarLevel}</p>
              <p><strong>Notes:</strong> {note.notes}</p>
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
