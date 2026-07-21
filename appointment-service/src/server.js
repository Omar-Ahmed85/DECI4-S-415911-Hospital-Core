require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const appointmentRoutes = require('./routes/appointments');

const app = express();
const PORT = process.env.APPOINTMENT_SERVICE_PORT || 5001;

app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (err) {
        res.status(503).json({ error: 'Database unavailable' });
    }
});

app.use('/api/appointments', appointmentRoutes);

app.get('/', (req, res) => res.json({ name: 'Appointment Service', status: 'ok' }));
app.use(notFound);
app.use(errorHandler);

async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Appointment service running on port ${PORT}`));
    } catch (err) {
        console.error('[startup] Fatal:', err.message);
        process.exit(1);
    }
}

if (require.main === module) start();

module.exports = app;
