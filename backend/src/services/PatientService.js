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
        const { medicalHistory, ...patientData } = data;
        const patient = new Patient(patientData);
        const saved = await patient.save();
        if (medicalHistory && medicalHistory.diagnosis) {
            await MedicalHistory.create({ patientId: saved._id, ...medicalHistory });
        }
        return saved;
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

    async addMedicalHistory(patientId, data) {
        const patient = await Patient.findById(patientId);
        if (!patient) return null;
        return await MedicalHistory.create({ patientId, ...data });
    }
}

module.exports = new PatientService();
