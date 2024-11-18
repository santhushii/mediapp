const db = require('./db/db'); // Import the database setup file

// Insert data into the patient_form table
const stmt = db.prepare(`
    INSERT INTO patient_form (name, age, email, address)
    VALUES (?, ?, ?, ?)
`);

// Run the insert statement with test data
stmt.run('John Doe', 30, 'john.doe@example.com', '123 Main St');

console.log('Test data inserted successfully!');
