const express = require('express');
const router = express.Router();
const professionalController = require('../controllers/professionalController');

//get Professional;

router.get('/profesional', professionalController.getProfesionales);
router.post('/profesional', professionalController.createProfesional);

module.exports  = router;