const { mongoose } = require('../config/db');

const appointmentSchema = new mongoose.Schema({
    patientId: { type: String, required: true, index: true },
    doctorId: { type: String, required: true, index: true },
    date: { type: Date, required: true },
    status: { 
        type: String, 
        enum: ['scheduled', 'confirmed', 'cancelled', 'completed'], 
        default: 'scheduled' 
    },
    reason: { type: String, default: '' },
    notes: { type: String, default: '' }
}, { timestamps: true });

appointmentSchema.index({ date: 1, doctorId: 1 });

module.exports = mongoose.models.Appointment || mongoose.model('Appointment', appointmentSchema);
