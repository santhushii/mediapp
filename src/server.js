const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const db = require("./db/db"); // Ensure this points to your db.js file

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure the uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
    console.log("Uploads folder created.");
}

// Setup multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Add timestamp to file name
    },
});
const upload = multer({ storage });

// Serve uploaded files statically
app.use("/uploads", express.static(uploadDir));

// Ensure the `reviewed` column exists
try {
    db.prepare("ALTER TABLE patient_form ADD COLUMN reviewed INTEGER DEFAULT 0").run();
    console.log("Column `reviewed` added successfully!");
} catch (error) {
    if (error.message.includes("duplicate column name")) {
        console.log("Column `reviewed` already exists. Skipping...");
    } else {
        console.error("Error adding column `reviewed`:", error);
    }
}

// Route: Submit Form Data
app.post("/submit-form", upload.single("profileImage"), (req, res) => {
    console.log("Request Body:", req.body); // Debug incoming data
    console.log("Uploaded File:", req.file); // Debug uploaded file

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

    const profileImage = req.file ? req.file.filename : null; // Save file name or null if no image

    // Validate required fields
    if (!NIC) {
        console.error("Error: NIC is required.");
        return res.status(400).send({ error: "NIC is required." });
    }

    try {
        const stmt = db.prepare(
            `INSERT INTO patient_form 
            (NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage, reviewed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`
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
            specialNotes,
            profileImage
        );

        console.log("Data saved successfully to the database.");
        res.status(200).send({ message: "Form data saved successfully!" });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).send({ error: "Failed to save form data.", details: error.message });
    }
});

// Route: Get Current Patient
app.get("/get-current-patient", (req, res) => {
    try {
        const row = db.prepare("SELECT * FROM patient_form WHERE reviewed = 0 ORDER BY id DESC LIMIT 1").get();
        if (row && row.profileImage) {
            row.profileImage = `http://localhost:${PORT}/uploads/${row.profileImage}`;
        }
        console.log("Fetched current patient:", row);
        res.status(200).json(row || { error: "No current patient available." });
    } catch (error) {
        console.error("Error fetching current patient:", error);
        res.status(500).json({ error: "Failed to fetch current patient." });
    }
});

// Route: Mark as Reviewed
app.post("/mark-reviewed", (req, res) => {
    const { id } = req.body;
    console.log("Marking patient as reviewed, ID received from client:", id);

    if (!id) {
        console.error("Error: ID is required to mark patient as reviewed.");
        return res.status(400).send({ error: "ID is required to mark patient as reviewed." });
    }

    try {
        const stmt = db.prepare("UPDATE patient_form SET reviewed = 1 WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes > 0) {
            console.log("Patient marked as reviewed, ID:", id);
            res.status(200).send({ message: "Patient marked as reviewed." });
        } else {
            console.error("Error: Patient not found, ID:", id);
            res.status(404).send({ error: "Patient not found." });
        }
    } catch (error) {
        console.error("Error marking patient as reviewed:", error);
        res.status(500).send({ error: "Failed to mark patient as reviewed." });
    }
});

// Route: Get All Patients
app.get("/get-patients", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM patient_form WHERE reviewed = 1").all();
        console.log("Fetched patient history:", rows);
        res.status(200).json(rows || []);
    } catch (error) {
        console.error("Error fetching patient history:", error);
        res.status(500).json({ error: "Failed to fetch patient history." });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
