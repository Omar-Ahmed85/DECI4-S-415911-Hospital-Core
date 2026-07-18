require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const MedicalHistory = require('./models/MedicalHistory');

const patients = [
    { name: 'John Doe', age: 35, gender: 'Male', contact: '555-0101', address: '123 Main St' },
    { name: 'Jane Smith', age: 28, gender: 'Female', contact: '555-0102', address: '456 Oak Ave' },
    { name: 'Alex Johnson', age: 42, gender: 'Other', contact: '555-0103', address: '789 Pine Rd' },
    { name: 'Maria Garcia', age: 55, gender: 'Female', contact: '555-0104', address: '321 Elm Blvd' },
    { name: 'Robert Chen', age: 67, gender: 'Male', contact: '555-0105', address: '654 Maple Ln' }
];

const doctors = [
    { name: 'Dr. Sarah Lee', specialty: 'Cardiology', department: 'Heart Care', availability: ['Mon', 'Wed', 'Fri'] },
    { name: 'Dr. Michael Brown', specialty: 'Neurology', department: 'Brain & Spine', availability: ['Tue', 'Thu'] },
    { name: 'Dr. Emily Davis', specialty: 'Pediatrics', department: 'Children Health', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { name: 'Dr. James Wilson', specialty: 'General Surgery', department: 'Surgical', availability: ['Wed', 'Thu', 'Fri'] }
];

async function seed() {
    try {
        console.log('[seed] Connecting to MongoDB...');
        await connectDB();

        console.log('[seed] Dropping existing collections (DESTRUCTIVE)...');
        await Patient.deleteMany({});
        await Doctor.deleteMany({});
        await MedicalHistory.deleteMany({});

        console.log('[seed] Inserting patients...');
        const insertedPatients = await Patient.insertMany(patients);

        console.log('[seed] Inserting doctors...');
        await Doctor.insertMany(doctors);

        console.log('[seed] Inserting medical histories...');
        const histories = [
            { patientId: insertedPatients[0]._id, diagnosis: 'Hypertension', treatment: 'ACE inhibitor', notes: 'Stable', date: new Date('2026-01-15') },
            { patientId: insertedPatients[1]._id, diagnosis: 'Annual checkup', treatment: 'No medication', notes: 'Healthy', date: new Date('2026-02-20') },
            { patientId: insertedPatients[2]._id, diagnosis: 'Migraine', treatment: 'Sumatriptan', notes: 'Recurrent episodes', date: new Date('2026-03-10') }
        ];
        await MedicalHistory.insertMany(histories);

        console.log(`[seed] Done. Inserted ${insertedPatients.length} patients, ${doctors.length} doctors.`);
    } catch (err) {
        console.error('[seed] Failed:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

seed();
