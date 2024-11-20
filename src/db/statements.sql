-- Create the `patient_form` table if it does not exist
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

-- Insert statement to add a new patient record (placeholder values)
-- Replace the `?` placeholders with actual values when running queries
INSERT INTO patient_form (
    NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage, reviewed
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0
);

-- Select all records from the `patient_form` table
SELECT * FROM patient_form;

-- Delete a specific record by `id`
-- Replace `?` with the actual ID value to delete
DELETE FROM patient_form WHERE id = ?;

-- Ensure 'reviewed' column exists
-- Check if 'reviewed' column is already present
PRAGMA table_info(patient_form);

-- Add 'reviewed' column only if it doesn't exist
ALTER TABLE patient_form ADD COLUMN reviewed INTEGER DEFAULT 0;

-- Ensure 'profileImage' column exists
-- Check if 'profileImage' column is already present
PRAGMA table_info(patient_form);

-- Add 'profileImage' column only if it doesn't exist
ALTER TABLE patient_form ADD COLUMN profileImage TEXT DEFAULT NULL;
