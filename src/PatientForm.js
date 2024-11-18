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

  const [errors, setErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Handle input change for text and number inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prevData) => ({
        ...prevData,
        profileImage: URL.createObjectURL(file), // For preview purposes
      }));
    }
  };

  // Calculate BMI based on weight and height
  const calculateBMI = () => {
    const { weight, height } = formData;
    if (weight && height) {
      const heightInMeters = height / 100;
      const bmi = (weight / (heightInMeters ** 2)).toFixed(2);
      setFormData((prevData) => ({ ...prevData, bmi }));
    }
  };

  // Validate form data
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const response = await fetch("http://localhost:3001/submit-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setShowSuccessMessage(true);
          alert("Form data saved successfully!");
        } else {
          alert("Failed to save form data.");
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Patient Form</h2>
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
        <div className="form-group">
          <label>Upload Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>
        <button type="submit" className="submit-btn">
          Submit
        </button>
        {showSuccessMessage && (
          <p className="success-message">Form data saved successfully!</p>
        )}
      </form>
    </div>
  );
};

export default PatientForm;
