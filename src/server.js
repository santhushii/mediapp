const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db/db'); // Ensure the correct path to `db.js`

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// API to handle form submission
app.post('/submit-form', (req, res) => {
    const {
        NIC, name, age, sex, address, contact,
        weight, height, bmi, allergies, specialNotes, profileImage
    } = req.body;

    try {
        const stmt = db.prepare(`
            INSERT INTO patient_form (
                NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);
        stmt.run(
            NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage
        );

        res.status(200).send({ message: 'Form data saved successfully!' });
    } catch (error) {
        console.error('Error saving form data:', error);
        res.status(500).send({ error: 'Failed to save form data.' });
    }
});

// Start the server
const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
