const { mongoose } = require('../config/db');

const doctorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    specialty: { type: String, required: true, trim: true },
    department: { type: String, required: true, trim: true },
    availability: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.models.Doctor || mongoose.model('Doctor', doctorSchema);
