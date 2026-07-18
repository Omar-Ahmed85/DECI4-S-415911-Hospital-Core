const Doctor = require('../models/Doctor');

class DoctorService {
    async getAll() {
        return await Doctor.find().sort({ createdAt: -1 });
    }

    async getById(id) {
        return await Doctor.findById(id);
    }

    async create(data) {
        const doctor = new Doctor(data);
        return await doctor.save();
    }

    async update(id, data) {
        return await Doctor.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Doctor.findByIdAndDelete(id);
    }

    async getBySpecialty(specialty) {
        return await Doctor.find({ specialty }).sort({ name: 1 });
    }
}

module.exports = new DoctorService();
