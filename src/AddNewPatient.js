import React, { useState } from "react";
import "./AddNewPatient.css";

const AddNewPatient = () => {
  const [formData, setFormData] = useState({
    NIC: "",
    name: "",
    age: "",
    gender: "",
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

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "NIC" && value.length > 12) return; // NIC: max 12 characters
    if (name === "age" && !/^\d{0,3}$/.test(value)) return; // Age: only numbers, max 3 digits
    if ((name === "contact" || name === "weight" || name === "height") && !/^\d*$/.test(value)) {
      return; // Contact, Weight, Height: only numbers
    }

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
        profileImage: file,
      }));
    }
  };

  // Calculate BMI
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
    if (!formData.NIC) newErrors.NIC = "NIC is required.";
    if (!formData.name) newErrors.name = "Name is required.";
    if (!formData.age) newErrors.age = "Age is required.";
    if (!formData.gender) newErrors.gender = "Gender is required.";
    if (!formData.address) newErrors.address = "Address is required.";
    if (!formData.contact) newErrors.contact = "Contact is required.";
    if (!formData.weight) newErrors.weight = "Weight is required.";
    if (!formData.height) newErrors.height = "Height is required.";
    if (!formData.allergies) newErrors.allergies = "Allergies are required.";
    if (!formData.specialNotes) newErrors.specialNotes = "Special notes are required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        formDataToSend.append(key, formData[key]);
      });

      try {
        const response = await fetch("http://localhost:3001/submit-form", {
          method: "POST",
          body: formDataToSend,
        });

        if (response.ok) {
          alert("Form data saved successfully!");
          setShowSuccessMessage(true);
          setFormData({
            NIC: "",
            name: "",
            age: "",
            gender: "",
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
          alert("Failed to save form data.");
        }
      } catch (error) {
        console.error("Error during submission:", error);
        alert("An error occurred while saving form data.");
      }
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <h2>Add New Patient</h2>

        <div className="form-group">
          <label>NIC:</label>
          <input
            type="text"
            name="NIC"
            value={formData.NIC}
            onChange={handleInputChange}
            placeholder="Enter NIC (max 12 characters)"
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
            placeholder="Enter full name"
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
            placeholder="Enter age (max 3 digits)"
          />
          {errors.age && <p className="error">{errors.age}</p>}
        </div>

        <div className="form-group">
          <label>Gender:</label>
          <select name="gender" value={formData.gender} onChange={handleInputChange}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
          {errors.gender && <p className="error">{errors.gender}</p>}
        </div>

        <div className="form-group">
          <label>Address:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter address"
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
            placeholder="Enter contact number"
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
            placeholder="Enter weight"
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
            placeholder="Enter height"
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
            placeholder="Enter allergies"
          />
          {errors.allergies && <p className="error">{errors.allergies}</p>}
        </div>

        <div className="form-group">
          <label>Special Notes:</label>
          <textarea
            name="specialNotes"
            value={formData.specialNotes}
            onChange={handleInputChange}
            placeholder="Enter special notes"
          />
          {errors.specialNotes && <p className="error">{errors.specialNotes}</p>}
        </div>

        <div className="form-group">
          <label>Profile Image:</label>
          <input type="file" accept="image/*" onChange={handleImageUpload} />
        </div>

        <button type="submit" className="submit-btn">
          Submit
        </button>
        {showSuccessMessage && <p className="success-message">Form submitted successfully!</p>}
      </form>
    </div>
  );
};

export default AddNewPatient;
