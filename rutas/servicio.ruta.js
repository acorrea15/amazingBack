const express = require('express');
const router = express.Router();
const servicioController = require('../controllers/servicioController');

//get Servicios;

router.get('/servicios', servicioController.getServicios);
router.post('/newServicio', servicioController.createServicio);

module.exports  = router;
