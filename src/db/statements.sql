
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
    allergies TEXT,
    specialNotes TEXT,
    profileImage TEXT
);

INSERT INTO patient_form (
    NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage
) VALUES (
    ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
);


SELECT * FROM patient_form;

DELETE FROM patient_form WHERE id = 1;
