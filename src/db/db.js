const Database = require("better-sqlite3");

// Create or open the SQLite database file
const db = new Database("mediapp.db", { verbose: console.log }); // `verbose` logs executed SQL queries for debugging

// Initialize database schema
const initializeDB = () => {
  try {
    console.log("Initializing database...");

    // Create `patient_form` table
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
        profileImage TEXT DEFAULT NULL,
        reviewed INTEGER DEFAULT 0
      );
    `);
    console.log("Table `patient_form` ensured successfully!");

    // Create `health_notes` table
    db.exec(`
      CREATE TABLE IF NOT EXISTS health_notes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        patientId INTEGER NOT NULL,
        pressureLevel TEXT,
        sugarLevel TEXT,
        notes TEXT,
        FOREIGN KEY(patientId) REFERENCES patient_form(id) ON DELETE CASCADE
      );
    `);
    console.log("Table `health_notes` ensured successfully!");

    // Create `users` table for login/signup
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);
    console.log("Table `users` ensured successfully!");

    // Enable foreign key constraints
    db.exec("PRAGMA foreign_keys = ON;");
    console.log("Foreign key constraints enabled.");
  } catch (error) {
    console.error("Error during database initialization:", error.message);
    process.exit(1); // Exit the application if the database setup fails
  }
};

// Initialize database on load
initializeDB();

// Export the database instance for use in other modules
module.exports = db;
