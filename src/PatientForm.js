import React, { useState } from "react";
import "./PatientForm.css";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    NIC: "",
    name: "",
    age: "",
    sex: "",
    address: "",
    contact: "",
    weight: "",
    height: "",
    bmi: "",
    allergies: "",
    profileImage: null,
  });

  const [submittedData, setSubmittedData] = useState(null); // State to store submitted data

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: URL.createObjectURL(file),
      }));
    }
  };

  const calculateBMI = () => {
    const { weight, height } = formData;
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters ** 2)).toFixed(2);
      setFormData((prevData) => ({ ...prevData, bmi }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmittedData(formData); // Save submitted data
  };

  const handleEdit = () => {
    setSubmittedData(null); // Clear submitted data to go back to form
  };

  return (
    <div className="form-container">
      {submittedData ? (
        <div className="submitted-details">
          <div className="header">
            <div className="profile-section">
              {submittedData.profileImage ? (
                <img
                  src={submittedData.profileImage}
                  alt="Patient"
                  className="profile-image"
                />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="title-section">
              <h2>Patient Details</h2>
              <p>{submittedData.name}</p>
            </div>
          </div>
          <div className="details">
            <p><strong>NIC:</strong> {submittedData.NIC}</p>
            <p><strong>Name:</strong> {submittedData.name}</p>
            <p><strong>Age:</strong> {submittedData.age}</p>
            <p><strong>Sex:</strong> {submittedData.sex}</p>
            <p><strong>Address:</strong> {submittedData.address}</p>
            <p><strong>Contact:</strong> {submittedData.contact}</p>
            <p><strong>Weight:</strong> {submittedData.weight} kg</p>
            <p><strong>Height:</strong> {submittedData.height} cm</p>
            <p><strong>BMI:</strong> {submittedData.bmi}</p>
            <p><strong>Allergies:</strong> {submittedData.allergies}</p>
          </div>
          <button className="submit-btn" onClick={handleEdit}>
            Edit Details
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="header">
            <div className="profile-section">
              {formData.profileImage ? (
                <img
                  src={formData.profileImage}
                  alt="Patient"
                  className="profile-image"
                />
              ) : (
                <div className="placeholder-image">No Image</div>
              )}
            </div>
            <div className="title-section">
              <h2>Patient Details</h2>
              <p>{formData.name || "Record of a patient's medical details"}</p>
            </div>
          </div>
          <div className="form-group">
            <label>Upload Image:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </div>
          <div className="form-group">
            <label>NIC:</label>
            <input
              type="text"
              name="NIC"
              value={formData.NIC}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Sex:</label>
            <select
              name="sex"
              value={formData.sex}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>Weight (kg):</label>
            <input
              type="number"
              name="weight"
              value={formData.weight}
              onChange={(e) => {
                handleInputChange(e);
                calculateBMI();
              }}
            />
          </div>
          <div className="form-group">
            <label>Height (cm):</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={(e) => {
                handleInputChange(e);
                calculateBMI();
              }}
            />
          </div>
          <div className="form-group">
            <label>BMI:</label>
            <input type="text" name="bmi" value={formData.bmi} readOnly />
          </div>
          <div className="form-group">
            <label>Allergies:</label>
            <textarea
              name="allergies"
              value={formData.allergies}
              onChange={handleInputChange}
            />
          </div>
          <button type="submit" className="submit-btn">
            Submit
          </button>
        </form>
      )}
    </div>
  );
};

export default PatientForm;
