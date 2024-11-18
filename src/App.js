import React from "react";
import PatientForm from "./PatientForm"; // Ensure this path matches the location of your `PatientForm.js`

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Patient Management System</h1>
      </header>
      <main>
        <PatientForm />
      </main>
    </div>
  );
}

export default App;
