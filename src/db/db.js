const Database = require('better-sqlite3');

// Create or open the SQLite database file
const db = new Database('mediapp.db');

// Create the `patient_form` table if it doesn't already exist
db.exec(`
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
`);

console.log('Database initialized successfully!');

// Export the database instance for use in other modules
module.exports = db;
