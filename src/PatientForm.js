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
    specialNotes: "",
    profileImage: null,
  });

  const [submittedData, setSubmittedData] = useState(null); // State for submitted data
  const [showSuccessMessage, setShowSuccessMessage] = useState(false); // State for success message
  const [errors, setErrors] = useState({}); // State for form validation errors

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

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key] && key !== "profileImage" && key !== "bmi") {
        newErrors[key] = "This field is required.";
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setSubmittedData(formData); // Save submitted data
      setShowSuccessMessage(false); // Reset success message
    }
  };

  const handleEdit = () => {
    setSubmittedData(null); // Clear submitted data to go back to form
  };

  const handleSave = () => {
    setShowSuccessMessage(true); // Show success message
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
            <p><strong>Special Notes:</strong> {submittedData.specialNotes}</p>
          </div>
          <div className="button-group">
            <button className="submit-btn" onClick={handleEdit}>
              Edit Details
            </button>
            <button className="submit-btn" onClick={handleSave}>
              Save Details
            </button>
          </div>
          {showSuccessMessage && (
            <p className="success-message">Successfully added details!</p>
          )}
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
            {errors.NIC && <p className="error">{errors.NIC}</p>}
          </div>
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
            />
            {errors.name && <p className="error">{errors.name}</p>}
          </div>
          <div className="form-group">
            <label>Age:</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
            />
            {errors.age && <p className="error">{errors.age}</p>}
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
            {errors.sex && <p className="error">{errors.sex}</p>}
          </div>
          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
            />
            {errors.address && <p className="error">{errors.address}</p>}
          </div>
          <div className="form-group">
            <label>Contact:</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
            />
            {errors.contact && <p className="error">{errors.contact}</p>}
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
            {errors.weight && <p className="error">{errors.weight}</p>}
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
            {errors.height && <p className="error">{errors.height}</p>}
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
            {errors.allergies && <p className="error">{errors.allergies}</p>}
          </div>
          <div className="form-group">
            <label>Special Notes:</label>
            <textarea
              name="specialNotes"
              value={formData.specialNotes}
              onChange={handleInputChange}
            />
            {errors.specialNotes && <p className="error">{errors.specialNotes}</p>}
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
