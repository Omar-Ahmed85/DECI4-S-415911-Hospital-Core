const DoctorService = require('../services/DoctorService');

class DoctorController {
    async getAll(req, res, next) {
        try {
            const doctors = await DoctorService.getAll();
            res.json(doctors);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const doctor = await DoctorService.getById(req.params.id);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            res.json(doctor);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const doctor = await DoctorService.create(req.body);
            res.status(201).json({ message: 'Doctor created', id: doctor._id, doctor });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const doctor = await DoctorService.update(req.params.id, req.body);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            res.json({ message: 'Doctor updated', doctor });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const doctor = await DoctorService.delete(req.params.id);
            if (!doctor) {
                return res.status(404).json({ message: 'Doctor not found' });
            }
            res.json({ message: 'Doctor deleted' });
        } catch (error) {
            next(error);
        }
    }

    async getBySpecialty(req, res, next) {
        try {
            const { specialty } = req.params;
            const doctors = await DoctorService.getBySpecialty(specialty);
            res.json(doctors);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new DoctorController();
