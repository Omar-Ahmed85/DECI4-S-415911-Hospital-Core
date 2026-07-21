const PatientService = require('../services/PatientService');

class PatientController {
    async getAll(req, res, next) {
        try {
            const patients = await PatientService.getAll();
            res.json(patients);
        } catch (error) {
            next(error);
        }
    }

    async getById(req, res, next) {
        try {
            const patient = await PatientService.getById(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json(patient);
        } catch (error) {
            next(error);
        }
    }

    async create(req, res, next) {
        try {
            const patient = await PatientService.create(req.body);
            res.status(201).json({ message: 'Patient created', id: patient._id, patient });
        } catch (error) {
            next(error);
        }
    }

    async update(req, res, next) {
        try {
            const patient = await PatientService.update(req.params.id, req.body);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json({ message: 'Patient updated', patient });
        } catch (error) {
            next(error);
        }
    }

    async delete(req, res, next) {
        try {
            const patient = await PatientService.delete(req.params.id);
            if (!patient) {
                return res.status(404).json({ message: 'Patient not found' });
            }
            res.json({ message: 'Patient deleted' });
        } catch (error) {
            next(error);
        }
    }

    async search(req, res, next) {
        try {
            const { q } = req.query;
            if (!q) {
                return res.status(400).json({ message: 'Search query required' });
            }
            const patients = await PatientService.search(q);
            res.json(patients);
        } catch (error) {
            next(error);
        }
    }

    async getMedicalHistory(req, res, next) {
        try {
            const history = await PatientService.getMedicalHistory(req.params.id);
            res.json(history);
        } catch (error) {
            next(error);
        }
    }

    async addMedicalHistory(req, res, next) {
        try {
            const entry = await PatientService.addMedicalHistory(req.params.id, req.body);
            res.status(201).json({ message: 'History entry added', entry });
        } catch (error) {
            next(error);
        }
    }
}

module.exports = new PatientController();
