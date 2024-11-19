const db = require('./db/db'); // Correct path to `db.js`

// Function to fetch and display all records from the `patient_form` table
const viewPatientRecords = () => {
    try {
        // Fetch all records from the `patient_form` table
        const rows = db.prepare('SELECT * FROM patient_form').all();

        if (rows.length === 0) {
            console.log('No patient records found.');
        } else {
            console.log('Patient Records:');
            console.table(rows);
        }
    } catch (error) {
        console.error('Error fetching patient records:', error.message);
    }
};

// Call the function to view patient records
viewPatientRecords();
