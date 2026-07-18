const express = require('express');
const AppointmentController = require('../controllers/AppointmentController');

const router = express.Router();

router.get('/availability', AppointmentController.checkAvailability.bind(AppointmentController));
router.get('/patient/:patientId', AppointmentController.getByPatient.bind(AppointmentController));
router.get('/doctor/:doctorId', AppointmentController.getByDoctor.bind(AppointmentController));
router.get('/', AppointmentController.getAll.bind(AppointmentController));
router.post('/', AppointmentController.create.bind(AppointmentController));
router.get('/:id', AppointmentController.getById.bind(AppointmentController));
router.put('/:id', AppointmentController.update.bind(AppointmentController));
router.delete('/:id', AppointmentController.delete.bind(AppointmentController));

module.exports = router;
