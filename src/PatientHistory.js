import React, { useEffect, useState } from "react";

const PatientHistory = () => {
    const [currentPatient, setCurrentPatient] = useState(null); // Current History Card
    const [history, setHistory] = useState([]); // History Table
    const [error, setError] = useState(null);

    // Fetch the current patient details
    useEffect(() => {
        const fetchCurrentPatient = async () => {
            try {
                const response = await fetch("http://localhost:3001/get-current-patient");
                if (!response.ok) throw new Error("Failed to fetch current patient");
                const data = await response.json();
                setCurrentPatient(data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchCurrentPatient();
    }, []);

    // Fetch all patient history except the most recent one
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch("http://localhost:3001/get-patients");
                if (!response.ok) throw new Error("Failed to fetch patient history");
                const data = await response.json();
                setHistory(data.slice(1)); // Exclude the most recent record
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

            {/* Current History Card */}
            {currentPatient ? (
                <div className="current-card">
                    <h3>Current History</h3>
                    <p><strong>NIC:</strong> {currentPatient.NIC}</p>
                    <p><strong>Name:</strong> {currentPatient.name}</p>
                    <p><strong>Age:</strong> {currentPatient.age}</p>
                    <p><strong>Sex:</strong> {currentPatient.sex}</p>
                    <p><strong>Contact:</strong> {currentPatient.contact}</p>
                    <p><strong>BMI:</strong> {currentPatient.bmi}</p>
                    <p><strong>Allergies:</strong> {currentPatient.allergies}</p>
                    <p><strong>Special Notes:</strong> {currentPatient.specialNotes}</p>
                </div>
            ) : (
                <p>No current patient details available.</p>
            )}

            {/* History Table */}
            {history.length > 0 ? (
                <div>
                    <h3>All Patients</h3>
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
                </div>
            ) : (
                <p>No previous patient history available.</p>
            )}
        </div>
    );
};

export default PatientHistory;
