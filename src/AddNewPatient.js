import React, { useState } from "react";
import "./AddNewPatient.css";

const AddNewPatient = () => {
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
        profileImage: file, // Store the file object for uploading
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
        newErrors[key] = `${key.charAt(0).toUpperCase() + key.slice(1)} is required.`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior

    if (validateForm()) {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "profileImage" && formData[key]) {
          formDataToSend.append(key, formData[key]);
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      console.log("Form Data to Send (Debug):", ...formDataToSend.entries()); // Debugging: Check data

      try {
        const response = await fetch("http://localhost:3001/submit-form", {
          method: "POST",
          body: formDataToSend,
        });

        if (response.ok) {
          alert("Form data saved successfully!");
          setShowSuccessMessage(true);
          // Reset form data
          setFormData({
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
        } else {
          const errorData = await response.json();
          console.error("Error from Server:", errorData);
          alert("Failed to save form data.");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred while saving form data.");
      }
    } else {
      console.log("Validation Failed:", errors); // Debug validation errors
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Add New Patient</h2>

        {/* NIC Field */}
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

        {/* Name Field */}
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

        {/* Age Field */}
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

        {/* Sex Field */}
        <div className="form-group">
          <label>Sex:</label>
          <select name="sex" value={formData.sex} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.sex && <p className="error">{errors.sex}</p>}
        </div>

        {/* Address Field */}
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

        {/* Contact Field */}
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

        {/* Weight and Height */}
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

        {/* BMI Field */}
        <div className="form-group">
          <label>BMI:</label>
          <input type="text" name="bmi" value={formData.bmi} readOnly />
        </div>

        {/* Allergies Field */}
        <div className="form-group">
          <label>Allergies:</label>
          <textarea
            name="allergies"
            value={formData.allergies}
            onChange={handleInputChange}
          />
          {errors.allergies && <p className="error">{errors.allergies}</p>}
        </div>

        {/* Special Notes Field */}
        <div className="form-group">
          <label>Special Notes:</label>
          <textarea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleInputChange}
          />
          {errors.specialNotes && <p className="error">{errors.specialNotes}</p>}
        </div>

        {/* Profile Image Upload */}
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

export default AddNewPatient;
