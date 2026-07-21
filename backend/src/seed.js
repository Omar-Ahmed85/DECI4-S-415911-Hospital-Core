require('dotenv').config();
const mongoose = require('mongoose');
const { connectDB } = require('./config/db');
const Patient = require('./models/Patient');
const Doctor = require('./models/Doctor');
const MedicalHistory = require('./models/MedicalHistory');

const patients = [
    { name: 'John Doe', age: 35, gender: 'Male', contact: '555-0101', address: '123 Main St, New York' },
    { name: 'Jane Smith', age: 28, gender: 'Female', contact: '555-0102', address: '456 Oak Ave, Boston' },
    { name: 'Alex Johnson', age: 42, gender: 'Other', contact: '555-0103', address: '789 Pine Rd, Chicago' },
    { name: 'Maria Garcia', age: 55, gender: 'Female', contact: '555-0104', address: '321 Elm Blvd, Miami' },
    { name: 'Robert Chen', age: 67, gender: 'Male', contact: '555-0105', address: '654 Maple Ln, Seattle' },
    { name: 'Sarah Williams', age: 31, gender: 'Female', contact: '555-0106', address: '987 Cedar St, Denver' },
    { name: 'Michael Brown', age: 45, gender: 'Male', contact: '555-0107', address: '741 Birch Dr, Austin' },
    { name: 'Emily Davis', age: 23, gender: 'Female', contact: '555-0108', address: '852 Spruce Way, Portland' },
    { name: 'David Martinez', age: 58, gender: 'Male', contact: '555-0109', address: '963 Willow Ct, Phoenix' },
    { name: 'Lisa Anderson', age: 39, gender: 'Female', contact: '555-0110', address: '159 Ash Ln, Atlanta' },
    { name: 'James Taylor', age: 72, gender: 'Male', contact: '555-0111', address: '357 Oak Park, Dallas' },
    { name: 'Patricia Moore', age: 50, gender: 'Female', contact: '555-0112', address: '486 Pine Grove, Orlando' }
];

const doctors = [
    { name: 'Dr. Sarah Lee', specialty: 'Cardiology', department: 'Heart Care', availability: ['Mon', 'Wed', 'Fri'] },
    { name: 'Dr. Michael Brown', specialty: 'Neurology', department: 'Brain & Spine', availability: ['Tue', 'Thu'] },
    { name: 'Dr. Emily Davis', specialty: 'Pediatrics', department: 'Children Health', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { name: 'Dr. James Wilson', specialty: 'General Surgery', department: 'Surgical', availability: ['Wed', 'Thu', 'Fri'] },
    { name: 'Dr. Linda Martinez', specialty: 'Dermatology', department: 'Skin Care', availability: ['Mon', 'Wed', 'Fri'] },
    { name: 'Dr. Robert Anderson', specialty: 'Orthopedics', department: 'Bone & Joint', availability: ['Tue', 'Thu', 'Sat'] },
    { name: 'Dr. Jennifer Taylor', specialty: 'Oncology', department: 'Cancer Care', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] },
    { name: 'Dr. William Garcia', specialty: 'Psychiatry', department: 'Mental Health', availability: ['Mon', 'Wed', 'Fri'] },
    { name: 'Dr. Amanda White', specialty: 'Gastroenterology', department: 'Digestive Health', availability: ['Tue', 'Thu'] },
    { name: 'Dr. Christopher Moore', specialty: 'Endocrinology', department: 'Hormone & Metabolism', availability: ['Mon', 'Wed', 'Fri'] },
    { name: 'Dr. Jessica Thomas', specialty: 'Ophthalmology', department: 'Eye Care', availability: ['Tue', 'Thu', 'Sat'] },
    { name: 'Dr. Daniel Jackson', specialty: 'Urology', department: 'Urinary System', availability: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'] }
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
            { patientId: insertedPatients[0]._id, diagnosis: 'Hypertension', treatment: 'ACE inhibitor', notes: 'Stable blood pressure', date: new Date('2026-01-15') },
            { patientId: insertedPatients[1]._id, diagnosis: 'Annual checkup', treatment: 'No medication', notes: 'Healthy', date: new Date('2026-02-20') },
            { patientId: insertedPatients[2]._id, diagnosis: 'Migraine', treatment: 'Sumatriptan', notes: 'Recurrent episodes', date: new Date('2026-03-10') },
            { patientId: insertedPatients[3]._id, diagnosis: 'Type 2 Diabetes', treatment: 'Metformin', notes: 'Blood sugar monitoring required', date: new Date('2026-01-22') },
            { patientId: insertedPatients[4]._id, diagnosis: 'Arthritis', treatment: 'NSAIDs', notes: 'Chronic joint pain', date: new Date('2026-02-14') },
            { patientId: insertedPatients[5]._id, diagnosis: 'Asthma', treatment: 'Inhaler (albuterol)', notes: 'Seasonal triggers', date: new Date('2026-03-05') },
            { patientId: insertedPatients[6]._id, diagnosis: 'High Cholesterol', treatment: 'Statin therapy', notes: 'Diet modification recommended', date: new Date('2026-01-30') },
            { patientId: insertedPatients[7]._id, diagnosis: 'Anxiety', treatment: 'SSRIs', notes: 'Regular therapy sessions', date: new Date('2026-02-18') }
        ];
        await MedicalHistory.insertMany(histories);

        console.log(`[seed] Done. Inserted ${insertedPatients.length} patients, ${doctors.length} doctors, ${histories.length} medical histories.`);
    } catch (err) {
        console.error('[seed] Failed:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
}

seed();
