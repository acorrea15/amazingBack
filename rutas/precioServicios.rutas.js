const express = require('express');
const router = express.Router();
const PrecioServicioController = require('../controllers/precioServiciosController'); 

router.get('/precios', PrecioServicioController.getPrecioServicios);
router.post('/precio', PrecioServicioController.createPrecioServicios);
router.put('/precio/:id', PrecioServicioController.updatePrecioServicios);

module.exports = router;
