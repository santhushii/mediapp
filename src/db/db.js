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
        profileImage TEXT,
        reviewed INTEGER DEFAULT 0
    );
`);


// Check for `reviewed` and `profileImage` columns and add them if missing
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

try {
    db.prepare("ALTER TABLE patient_form ADD COLUMN profileImage TEXT DEFAULT NULL").run();
    console.log("Column `profileImage` added successfully!");
} catch (error) {
    if (error.message.includes("duplicate column name")) {
        console.log("Column `profileImage` already exists. Skipping...");
    } else {
        console.error("Error adding column `profileImage`:", error);
    }
}

console.log('Database initialized successfully!');

// Export the database instance for use in other modules
module.exports = db;
