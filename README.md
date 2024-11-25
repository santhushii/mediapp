Patient Management App
A simple app to manage patient details, history, and New Prescription.

Features
Add patient details, including profile images.
View reviewed patient history.
Add New Prescription for pressure and sugar levels.
Delete reviewed patient records.
Prerequisites
Node.js and npm installed
SQLite3
Setup
Clone the repository:

git clone <repository-url>
cd <repository-folder>


Setup the backend:

cd server
npm install
node db/db.js
node server.js
The server will run on http://localhost:3001.

Setup the frontend:
cd ../client
npm install
npm start
The app will open in your browser at http://localhost:3000.

Usage
Add New Patient Tab: Add patient details.
Patient History Tab: View and delete reviewed patients.
New Prescription Tab: Add and view New Prescription.

API Overview
Patient Management
POST /submit-form: Add patient
GET /get-current-patient: Get current patient
POST /mark-reviewed: Mark patient as reviewed
GET /get-patients: Get all reviewed patients
DELETE /delete-patient/:id: Delete a reviewed patient


New Prescription
GET /new-prescription: Get New Prescription
POST /submit-new-prescription: Add a New prescription
