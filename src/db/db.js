const Database = require("better-sqlite3");

// Create or open the SQLite database file
const db = new Database("mediapp.db", { verbose: console.log });

// Initialize database schema
const initializeDB = () => {
  try {
    console.log("Initializing database...");

    // Drop and recreate the `users` table
    db.exec(`
      DROP TABLE IF EXISTS users;
      CREATE TABLE users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL
      );
    `);

    console.log("Table `users` created successfully!");

    // Add other tables here if needed
    // For example:
    db.exec(`
      CREATE TABLE IF NOT EXISTS patient_form (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        NIC TEXT NOT NULL,
        name TEXT NOT NULL,
        age INTEGER NOT NULL,
        gender TEXT NOT NULL,
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
