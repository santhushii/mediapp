const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const db = require("./db/db"); // Ensure this points to your db.js file

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route: Submit Form Data
app.post("/submit-form", (req, res) => {
    const {
        NIC,
        name,
        age,
        sex,
        address,
        contact,
        weight,
        height,
        bmi,
        allergies,
        specialNotes,
    } = req.body;

    try {
        const stmt = db.prepare(
            `INSERT INTO patient_form 
            (NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        );

        stmt.run(
            NIC,
            name,
            age,
            sex,
            address,
            contact,
            weight,
            height,
            bmi,
            allergies,
            specialNotes
        );

        res.status(200).send({ message: "Form data saved successfully!" });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).send({ error: "Failed to save form data." });
    }
});

// Route: Get Patient History
app.get("/get-patients", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM patient_form").all();
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching patient history:", error);
        res.status(500).json({ error: "Failed to fetch patient history." });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Fetch the most recent patient record
app.get("/get-current-patient", (req, res) => {
    try {
        const row = db.prepare("SELECT * FROM patient_form ORDER BY id DESC LIMIT 1").get();
        res.status(200).json(row);
    } catch (error) {
        console.error("Error fetching current patient:", error);
        res.status(500).json({ error: "Failed to fetch current patient." });
    }
});
