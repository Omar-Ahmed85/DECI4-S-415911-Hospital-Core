const mongoose = require('mongoose');

let connected = false;

async function connectDB() {
    if (connected) return mongoose.connection;
    const uri = process.env.APPOINTMENT_MONGODB_URI;
    if (!uri) {
        console.error('[appt-db] APPOINTMENT_MONGODB_URI is not set');
        throw new Error('APPOINTMENT_MONGODB_URI is not set');
    }
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        connected = true;
        console.log('Appointment MongoDB connected');
        return mongoose.connection;
    } catch (err) {
        console.error('[appt-db] MongoDB connection error:', err.message);
        throw err;
    }
}

module.exports = { connectDB, mongoose };