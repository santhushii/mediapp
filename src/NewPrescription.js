import React, { useState, useEffect } from "react";
import "./NewPrescription.css";

const NewPrescription = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    patientId: "",
    pressureLevel: "",
    sugarLevel: "",
    notes: "",
  });

  const [message, setMessage] = useState("");

  // Fetch prescriptions on load
  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch("http://localhost:3001/new-prescription");
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error("Failed to fetch prescriptions:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/submit-new-prescription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage("Prescription added successfully!");
        setFormData({ patientId: "", pressureLevel: "", sugarLevel: "", notes: "" });
        fetchPrescriptions(); // Refresh prescriptions
      } else {
        setMessage("Failed to add prescription.");
      }
    } catch (error) {
      console.error("Error adding prescription:", error);
      setMessage("Failed to add prescription.");
    }
  };

  return (
    <div className="prescription-container">
      <h2>New Prescription</h2>

      <form className="prescription-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Patient ID:</label>
          <input
            type="text"
            name="patientId"
            value={formData.patientId}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Pressure Level:</label>
          <input
            type="text"
            name="pressureLevel"
            value={formData.pressureLevel}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Sugar Level:</label>
          <input
            type="text"
            name="sugarLevel"
            value={formData.sugarLevel}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>
        <button type="submit" className="submit-btn">
          Add New Prescription
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}

      <h3>Recorded New Prescriptions</h3>
      <div className="card-container">
        {prescriptions.map((prescription, index) => (
          <div className="prescription-card" key={index}>
            <h4>Patient ID: {prescription.patientId}</h4>
            <p>
              <strong>Pressure Level:</strong> {prescription.pressureLevel}
            </p>
            <p>
              <strong>Sugar Level:</strong> {prescription.sugarLevel}
            </p>
            <p>
              <strong>Notes:</strong> {prescription.notes}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewPrescription;
