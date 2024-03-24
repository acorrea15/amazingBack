const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');

//get Professional;

router.get('/profesional', professionalController.getProfesionales);
router.post('/Newprofesional', professionalController.createProfesional);
router.delete('/deleteProfesional/:id', professionalController.deleteProfesional);

module.exports  = router;