import React, { useEffect, useState } from "react";

const PatientHistory = () => {
  const [history, setHistory] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch("http://localhost:3001/get-patients");
        if (!response.ok) {
          throw new Error("Failed to fetch patient history");
        }
        const data = await response.json();
        setHistory(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchHistory();
  }, []);

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h2>Patient History</h2>
      {history.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>NIC</th>
              <th>Name</th>
              <th>Age</th>
              <th>Sex</th>
              <th>Contact</th>
              <th>BMI</th>
              <th>Allergies</th>
              <th>Special Notes</th>
            </tr>
          </thead>
          <tbody>
            {history.map((record) => (
              <tr key={record.id}>
                <td>{record.id}</td>
                <td>{record.NIC}</td>
                <td>{record.name}</td>
                <td>{record.age}</td>
                <td>{record.sex}</td>
                <td>{record.contact}</td>
                <td>{record.bmi}</td>
                <td>{record.allergies}</td>
                <td>{record.specialNotes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No patient history available.</p>
      )}
    </div>
  );
};

export default PatientHistory;
