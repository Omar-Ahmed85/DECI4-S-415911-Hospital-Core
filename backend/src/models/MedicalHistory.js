const { mongoose } = require('../config/db');

const medicalHistorySchema = new mongoose.Schema({
    patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true, index: true },
    diagnosis: { type: String, required: true, trim: true },
    treatment: { type: String, default: '' },
    notes: { type: String, default: '' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.models.MedicalHistory || mongoose.model('MedicalHistory', medicalHistorySchema);