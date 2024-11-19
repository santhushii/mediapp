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

// Ensure the `reviewed` column exists in `patient_form`
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

// Ensure the `health_notes` table exists
try {
    db.exec(`
        CREATE TABLE IF NOT EXISTS health_notes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            patientId TEXT NOT NULL,
            pressureLevel TEXT NOT NULL,
            sugarLevel TEXT NOT NULL,
            notes TEXT
        );
    `);
    console.log("Health notes table ensured successfully!");
} catch (error) {
    console.error("Error ensuring health_notes table:", error);
}

// Route: Submit Form Data
app.post("/submit-form", upload.single("profileImage"), (req, res) => {
    console.log("Request Body:", req.body);
    console.log("Uploaded File:", req.file);

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

    const profileImage = req.file ? req.file.filename : null;

    if (!NIC) {
        return res.status(400).send({ error: "NIC is required." });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO patient_form 
            (NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage, reviewed) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `);
        stmt.run(
            NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage
        );

        res.status(200).send({ message: "Form data saved successfully!" });
    } catch (error) {
        console.error("Error saving form data:", error);
        res.status(500).send({ error: "Failed to save form data." });
    }
});

// Route: Get Current Patient
app.get("/get-current-patient", (req, res) => {
    try {
        const row = db.prepare("SELECT * FROM patient_form WHERE reviewed = 0 ORDER BY id DESC LIMIT 1").get();
        if (row && row.profileImage) {
            row.profileImage = `http://localhost:${PORT}/uploads/${row.profileImage}`;
        }
        res.status(200).json(row || { error: "No current patient available." });
    } catch (error) {
        console.error("Error fetching current patient:", error);
        res.status(500).json({ error: "Failed to fetch current patient." });
    }
});

// Route: Mark as Reviewed
app.post("/mark-reviewed", (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).send({ error: "ID is required to mark patient as reviewed." });
    }

    try {
        const stmt = db.prepare("UPDATE patient_form SET reviewed = 1 WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes > 0) {
            res.status(200).send({ message: "Patient marked as reviewed." });
        } else {
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
        res.status(200).json(rows || []);
    } catch (error) {
        console.error("Error fetching patient history:", error);
        res.status(500).json({ error: "Failed to fetch patient history." });
    }
});

// Route: Delete a Reviewed Patient
app.delete("/delete-patient/:id", (req, res) => {
    const { id } = req.params;
    if (!id) {
        return res.status(400).send({ error: "Patient ID is required to delete." });
    }

    try {
        const stmt = db.prepare("DELETE FROM patient_form WHERE id = ?");
        const result = stmt.run(id);

        if (result.changes > 0) {
            res.status(200).send({ message: "Patient deleted successfully." });
        } else {
            res.status(404).send({ error: "Patient not found." });
        }
    } catch (error) {
        console.error("Error deleting patient:", error);
        res.status(500).send({ error: "Failed to delete patient." });
    }
});

// Route: Fetch all health notes
app.get("/health-notes", (req, res) => {
    try {
        const rows = db.prepare("SELECT * FROM health_notes").all();
        res.status(200).json(rows || []);
    } catch (error) {
        console.error("Error fetching health notes:", error);
        res.status(500).json({ error: "Failed to fetch health notes." });
    }
});

// Route: Submit a new health note
app.post("/submit-health-note", (req, res) => {
    const { patientId, pressureLevel, sugarLevel, notes } = req.body;

    if (!patientId || !pressureLevel || !sugarLevel) {
        return res.status(400).send({ error: "Patient ID, Pressure Level, and Sugar Level are required." });
    }

    try {
        const stmt = db.prepare(`
            INSERT INTO health_notes (patientId, pressureLevel, sugarLevel, notes)
            VALUES (?, ?, ?, ?)
        `);
        stmt.run(patientId, pressureLevel, sugarLevel, notes || null);

        res.status(200).send({ message: "Health note added successfully!" });
    } catch (error) {
        console.error("Error saving health note:", error);
        res.status(500).send({ error: "Failed to save health note." });
    }
});

// Start the Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.post("/login", (req, res) => {
    const { username, password } = req.body;
  
    // Dummy credentials (replace with database validation)
    const validUsers = [
      { username: "admin", password: "admin123" },
      { username: "user", password: "user123" },
    ];
  
    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    );
  
    if (user) {
      res.status(200).send({ message: "Login successful", username: user.username });
    } else {
      res.status(401).send({ error: "Invalid username or password" });
    }
  });
  