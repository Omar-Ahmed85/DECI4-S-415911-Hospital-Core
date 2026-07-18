const AppointmentService = require('../services/AppointmentService');

class AppointmentController {
    async getAll(req, res, next) {
        try {
            const appointments = await AppointmentService.getAll();
            res.json(appointments);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const appointment = await AppointmentService.getById(req.params.id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json(appointment);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const { doctorId, date } = req.body;
            const available = await AppointmentService.checkAvailability(doctorId, date);
            if (!available) {
                return res.status(409).json({ message: 'Doctor not available at this time' });
            }
            const appointment = await AppointmentService.create(req.body);
            res.status(201).json({ message: 'Appointment booked', id: appointment._id, appointment });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const appointment = await AppointmentService.update(req.params.id, req.body);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json({ message: 'Appointment updated', appointment });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const appointment = await AppointmentService.delete(req.params.id);
            if (!appointment) {
                return res.status(404).json({ message: 'Appointment not found' });
            }
            res.json({ message: 'Appointment cancelled' });
        } catch (error) {
            next(error);
        }
    }

    async getByPatient(req, res, next) {
        try {
            const appointments = await AppointmentService.getByPatient(req.params.patientId);
            res.json(appointments);
        } catch (error) {
            next(error);
        }
    }

    async getByDoctor(req, res, next) {
        try {
            const appointments = await AppointmentService.getByDoctor(req.params.doctorId);
            res.json(appointments);
        } catch (error) {
            next(error);
        }
    }

    async checkAvailability(req, res, next) {
        try {
            const { doctorId, date } = req.query;
            if (!doctorId || !date) {
                return res.status(400).json({ message: 'doctorId and date required' });
            }
            const available = await AppointmentService.checkAvailability(doctorId, date);
            res.json({ available });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new AppointmentController();
