const Appointment = require('../models/Appointment');

class AppointmentService {
    async getAll() {
        return await Appointment.find().sort({ date: -1 });
    }

    async getById(id) {
        return await Appointment.findById(id);
    }

    async create(data) {
        const appointment = new Appointment(data);
        return await appointment.save();
    }

    async update(id, data) {
        return await Appointment.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    }

    async delete(id) {
        return await Appointment.findByIdAndDelete(id);
    }

    async getByPatient(patientId) {
        return await Appointment.find({ patientId }).sort({ date: -1 });
    }

    async getByDoctor(doctorId) {
        return await Appointment.find({ doctorId }).sort({ date: -1 });
    }

    async checkAvailability(doctorId, date) {
        const existing = await Appointment.findOne({ 
            doctorId, 
            date,
            status: { $in: ['scheduled', 'confirmed'] }
        });
        return !existing;
    }
}

module.exports = new AppointmentService();
