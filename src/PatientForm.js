import React, { useState } from "react";

const PatientForm = () => {
  const [formData, setFormData] = useState({
    uniqueID: "",
    name: "",
    age: "",
    sex: "",
    address: "",
    contact: "",
    weight: "",
    height: "",
    bmi: "",
    allergies: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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
    console.log("Form submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Patient Form</h2>
      <label>
        Unique ID:
        <input
          type="text"
          name="uniqueID"
          value={formData.uniqueID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Weight (kg):
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={(e) => {
            handleInputChange(e);
            calculateBMI();
          }}
        />
      </label>
      <label>
        Height (cm):
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={(e) => {
            handleInputChange(e);
            calculateBMI();
          }}
        />
      </label>
      <label>
        BMI:
        <input type="text" name="bmi" value={formData.bmi} readOnly />
      </label>
      <button type="submit">Submit</button>
    </form>
  );
};

export default PatientForm;
