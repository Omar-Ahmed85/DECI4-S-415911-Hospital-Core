const Patient = require('../models/Patient');
const MedicalHistory = require('../models/MedicalHistory');

class PatientService {
    async getAll() {
        return await Patient.find().sort({ createdAt: -1 });
    }

    async getById(id) {
        return await Patient.findById(id);
    }

    async create(data) {
        const patient = new Patient(data);
        return await patient.save();
    }

    async update(id, data) {
        return await Patient.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Patient.findByIdAndDelete(id);
    }

    async search(query) {
        const regex = new RegExp(query, 'i');
        return await Patient.find({
            $or: [
                { name: regex },
                { contact: regex }
            ]
        }).sort({ createdAt: -1 });
    }

    async getMedicalHistory(patientId) {
        return await MedicalHistory.find({ patientId }).sort({ date: -1 });
    }
}

module.exports = new PatientService();
