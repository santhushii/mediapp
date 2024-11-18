const db = require('./db/db'); // Correct path to `db.js`

// Fetch all records from the `patient_form` table
const rows = db.prepare('SELECT * FROM patient_form').all();

// Display the fetched records
console.log('Patient Records:');
console.table(rows);
