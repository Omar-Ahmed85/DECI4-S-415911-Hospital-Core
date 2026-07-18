const mongoose = require('mongoose');

let connected = false;

async function connectDB() {
    if (connected) return mongoose.connection;
    const uri = process.env.MONGODB_URI;
    if (!uri) {
        console.error('[db] MONGODB_URI is not set');
        throw new Error('MONGODB_URI is not set');
    }
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        connected = true;
        console.log('MongoDB connected');
        return mongoose.connection;
    } catch (err) {
        console.error('[db] MongoDB connection error:', err.message);
        throw err;
    }
}

module.exports = { connectDB, mongoose };
