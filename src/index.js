import React from 'react';
import ReactDOM from 'react-dom/client';
import PatientForm from './PatientForm'; // Import the PatientForm component

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <PatientForm /> {/* Render the PatientForm component */}
  </React.StrictMode>
);
