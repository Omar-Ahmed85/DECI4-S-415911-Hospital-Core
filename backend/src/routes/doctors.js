const express = require('express');
const { body, param } = require('express-validator');
const DoctorController = require('../controllers/DoctorController');
const validate = require('../middleware/validate');

const router = express.Router();
const doctorRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('specialty').trim().notEmpty().withMessage('Specialty is required'),
    body('department').trim().notEmpty().withMessage('Department is required')
];
const idRule = param('id').isMongoId().withMessage('Invalid doctor ID');
const specialtyRule = param('specialty').trim().notEmpty().withMessage('Specialty is required');

router.get('/specialty/:specialty', specialtyRule, validate, DoctorController.getBySpecialty.bind(DoctorController));
router.get('/', DoctorController.getAll.bind(DoctorController));
router.post('/', doctorRules, validate, DoctorController.create.bind(DoctorController));
router.get('/:id', idRule, validate, DoctorController.getById.bind(DoctorController));
router.put('/:id', idRule, validate, DoctorController.update.bind(DoctorController));
router.delete('/:id', idRule, validate, DoctorController.delete.bind(DoctorController));

module.exports = router;
