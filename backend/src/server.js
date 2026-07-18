require('dotenv').config();
const express = require('express');
const cors = require('cors');

const { connectDB } = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const requestLogger = require('./middleware/requestLogger');

const healthRoutes = require('./routes/health');
const patientRoutes = require('./routes/patients');
const doctorRoutes = require('./routes/doctors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(requestLogger);

app.use('/api/health', healthRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/doctors', doctorRoutes);

app.get('/', (req, res) => res.json({ name: 'Hospital Core API', status: 'ok' }));
app.use(notFound);
app.use(errorHandler);

async function start() {
    try {
        await connectDB();
        app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
    } catch (err) {
        console.error('[startup] Fatal:', err.message);
        process.exit(1);
    }
}

if (require.main === module) start();

module.exports = app;
