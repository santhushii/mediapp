const db = require('./db/db'); // Import the database setup file

// Insert data into the `patient_form` table
try {
    const stmt = db.prepare(`
        INSERT INTO patient_form (NIC, name, age, sex, address, contact, weight, height, bmi, allergies, specialNotes, profileImage, reviewed)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Insert sample test data
    stmt.run(
        '987654321V',       // NIC
        'John Doe',         // Name
        30,                 // Age
        'male',             // Sex
        '123 Main St',      // Address
        '0771234567',       // Contact
        75,                 // Weight in kg
        180,                // Height in cm
        23.15,              // BMI (calculated as weight / height^2 in meters)
        'No known allergies', // Allergies
        'Special note for testing', // Special notes
        null,               // Profile image (null for now)
        0                   // Reviewed (default to 0)
    );

    console.log('Test data inserted successfully!');
} catch (error) {
    console.error('Error inserting test data:', error.message);
}
