import React, { useState, useEffect } from "react";
import "./App.css"; // Ensure you create this CSS file for styling

const HealthNotes = () => {
  const [healthNotes, setHealthNotes] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    pressureLevel: "",
    sugarLevel: "",
    notes: "",
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch existing health notes on component load
  useEffect(() => {
    fetchHealthNotes();
  }, []);

  const fetchHealthNotes = async () => {
    try {
      const response = await fetch("http://localhost:3001/health-notes");
      if (response.ok) {
        const data = await response.json();
        setHealthNotes(data);
      } else {
        console.error("Failed to fetch health notes");
      }
    } catch (error) {
      console.error("Error fetching health notes:", error);
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
        const response = await fetch("http://localhost:3001/submit-health-note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccessMessage("Health note added successfully!");
          setFormData({
            patientId: "",
            pressureLevel: "",
            sugarLevel: "",
            notes: "",
          });
          fetchHealthNotes(); // Refresh the list
        } else {
          console.error("Failed to save health note");
        }
      } catch (error) {
        console.error("Error saving health note:", error);
      }
    }
  };

  return (
    <div className="health-notes-container">
      <h2>Health Notes</h2>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="health-notes-form">
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
          Add Health Note
        </button>
        {successMessage && <p className="success-message">{successMessage}</p>}
      </form>

      {/* Display Section */}
      <h3>Recorded Health Notes</h3>
      {healthNotes.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th>Pressure Level</th>
              <th>Sugar Level</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {healthNotes.map((note) => (
              <tr key={note.id}>
                <td>{note.id}</td>
                <td>{note.patientId}</td>
                <td>{note.pressureLevel}</td>
                <td>{note.sugarLevel}</td>
                <td>{note.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No health notes recorded yet.</p>
      )}
    </div>
  );
};

export default HealthNotes;
