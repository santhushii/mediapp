-- Create table if it does not exist
CREATE TABLE IF NOT EXISTS patient_form (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    NIC TEXT NOT NULL,
    name TEXT NOT NULL,
    age INTEGER NOT NULL,
    sex TEXT NOT NULL,
    address TEXT NOT NULL,
    contact TEXT NOT NULL,
    weight REAL NOT NULL,
    height REAL NOT NULL,
    bmi REAL NOT NULL,
    allergies TEXT DEFAULT NULL,
    specialNotes TEXT DEFAULT NULL,
    profileImage TEXT DEFAULT NULL,
    reviewed INTEGER DEFAULT 0 -- Indicates if the patient is reviewed
);

-- Insert statement to add a new patient record
INSERT INTO patient_form (
    NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage, reviewed
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0
);

-- Select all records from the patient_form table
SELECT * FROM patient_form;

-- Delete a specific record by id
DELETE FROM patient_form WHERE id = ?;

-- Ensure 'reviewed' column exists
ALTER TABLE patient_form ADD COLUMN reviewed INTEGER DEFAULT 0;

-- Ensure 'profileImage' column exists (optional if already in the table)
ALTER TABLE patient_form ADD COLUMN profileImage TEXT DEFAULT NULL;
