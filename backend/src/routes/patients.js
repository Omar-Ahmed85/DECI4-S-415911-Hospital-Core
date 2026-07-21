const express = require('express');
const { body, param } = require('express-validator');
const PatientController = require('../controllers/PatientController');
const validate = require('../middleware/validate');

const router = express.Router();
const patientRules = [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('age').isInt({ min: 0 }).withMessage('Age must be a non-negative integer'),
    body('gender').isIn(['Male', 'Female', 'Other']).withMessage('Gender must be Male, Female, or Other')
];
const idRule = param('id').isMongoId().withMessage('Invalid patient ID');
const historyRules = [
    body('diagnosis').trim().notEmpty().withMessage('Diagnosis is required'),
    body('treatment').optional().isString(),
    body('notes').optional().isString()
];

router.get('/search', PatientController.search.bind(PatientController));
router.get('/:id/history', idRule, validate, PatientController.getMedicalHistory.bind(PatientController));
router.post('/:id/history', idRule, historyRules, validate, PatientController.addMedicalHistory.bind(PatientController));
router.get('/', PatientController.getAll.bind(PatientController));
router.post('/', patientRules, validate, PatientController.create.bind(PatientController));
router.get('/:id', idRule, validate, PatientController.getById.bind(PatientController));
router.put('/:id', idRule, validate, PatientController.update.bind(PatientController));
router.delete('/:id', idRule, validate, PatientController.delete.bind(PatientController));

module.exports = router;
