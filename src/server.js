const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sqlite3 = require("sqlite3").verbose();
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = process.env.SECRET_KEY || "your_jwt_secret";

// SQLite Database Initialization
const db = new sqlite3.Database("app.db", (err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("Connected to SQLite database.");
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ensure Tables Exist
db.serialize(() => {
  const createTables = [
    `CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS patient_form (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      NIC TEXT NOT NULL,
      name TEXT NOT NULL,
      age INTEGER,
      gender TEXT,
      address TEXT,
      contact TEXT,
      weight REAL,
      height REAL,
      bmi REAL,
      allergies TEXT,
      specialNotes TEXT,
      profileImage TEXT,
      reviewed INTEGER DEFAULT 0
    )`,
    `CREATE TABLE IF NOT EXISTS new_prescription (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      pressureLevel TEXT,
      sugarLevel TEXT,
      notes TEXT
    )`,
  ];

  createTables.forEach((query) => {
    db.run(query, (err) => {
      if (err) console.error("Failed to create table:", err.message);
    });
  });
});

// Ensure uploads folder exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });
app.use("/uploads", express.static(uploadDir));

// --- Authentication Routes ---
// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) {
      return res.status(500).json({ error: "Database error during email check." });
    }

    if (user) {
      return res.status(409).json({ error: "Email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    db.run(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, hashedPassword],
      function (err) {
        if (err) {
          return res.status(500).json({ error: "Failed to register user." });
        }
        res.status(201).json({ message: "User registered successfully!" });
      }
    );
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err) return res.status(500).json({ error: "Database error." });
    if (!user) return res.status(401).json({ error: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials." });

    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "Login successful!", token });
  });
});

// Forgot Password Endpoint
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Email is required." });

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (err) return res.status(500).json({ error: "Database error" });
    if (!user) return res.status(404).json({ error: "Email not found" });

    console.log(`Reset link sent to ${email}`);
    res.status(200).json({ message: "Reset instructions sent to your email!" });
  });
});

// --- Patient Form Routes ---
// Submit Add New Patient
app.post("/submit-form", upload.single("profileImage"), (req, res) => {
  const {
    NIC,
    name,
    age,
    gender,
    address,
    contact,
    weight,
    height,
    bmi,
    allergies,
    specialNotes,
  } = req.body;

  const profileImage = req.file ? req.file.filename : null;

  db.run(
    `INSERT INTO patient_form (NIC, name, age, gender, address, contact, weight, height, bmi, allergies, specialNotes, profileImage, reviewed) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [NIC, name, age, gender, address, contact, weight, height, bmi, allergies, specialNotes, profileImage],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to save form data." });
      res.status(200).json({ message: "Form data saved successfully!" });
    }
  );
});

// Fetch Current Patient
app.get("/get-current-patient", (req, res) => {
  db.get("SELECT * FROM patient_form WHERE reviewed = 0 ORDER BY id DESC LIMIT 1", (err, row) => {
    if (err) return res.status(500).json({ error: "Failed to fetch current patient." });
    if (row && row.profileImage) {
      row.profileImage = `http://localhost:${PORT}/uploads/${row.profileImage}`;
    }
    res.status(200).json(row || { error: "No current patient available." });
  });
});

// Get Reviewed Patients
app.get("/get-patients", (req, res) => {
  db.all("SELECT * FROM patient_form WHERE reviewed = 1", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch patient history." });
    res.status(200).json(rows || []);
  });
});

// Mark Patient as Reviewed
app.post("/mark-reviewed", (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).json({ error: "ID is required to mark patient as reviewed." });

  db.run("UPDATE patient_form SET reviewed = 1 WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to mark patient as reviewed." });
    if (this.changes > 0) res.status(200).json({ message: "Patient marked as reviewed." });
    else res.status(404).json({ error: "Patient not found." });
  });
});

// Delete Patient
app.delete("/delete-patient/:id", (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).json({ error: "Patient ID is required to delete." });

  db.run("DELETE FROM patient_form WHERE id = ?", [id], function (err) {
    if (err) return res.status(500).json({ error: "Failed to delete patient." });
    if (this.changes > 0) res.status(200).json({ message: "Patient deleted successfully." });
    else res.status(404).json({ error: "Patient not found." });
  });
});

// --- Prescription Routes ---
// Submit New Prescription
app.post("/submit-new-prescription", (req, res) => {
  const { patientId, pressureLevel, sugarLevel, notes } = req.body;

  if (!patientId || !pressureLevel || !sugarLevel) {
    return res.status(400).json({ error: "Patient ID, Pressure Level, and Sugar Level are required." });
  }

  db.run(
    `INSERT INTO new_prescription (patientId, pressureLevel, sugarLevel, notes) VALUES (?, ?, ?, ?)`,
    [patientId, pressureLevel, sugarLevel, notes],
    function (err) {
      if (err) return res.status(500).json({ error: "Failed to save new prescription." });
      res.status(200).json({ message: "New prescription added successfully!" });
    }
  );
});

// Fetch New Prescription
app.get("/new-prescription", (req, res) => {
  db.all("SELECT * FROM new_prescription", (err, rows) => {
    if (err) return res.status(500).json({ error: "Failed to fetch new prescriptions." });
    res.status(200).json(rows || []);
  });
});

// --- Start the Server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
