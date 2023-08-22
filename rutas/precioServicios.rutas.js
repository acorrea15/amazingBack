// const express = require('express');
// const router = express.Router();
// const PrecioServicioController = require('../controllers/precioServiciosController'); 

// router.get('/precios', PrecioServicioController.getPrecioServicios);
// router.post('/precio', PrecioServicioController.createPrecioServicios);
// router.put('/precio/:id', PrecioServicioController.updatePrecioServicios);

// module.exports = router;

const express = require("express");
const router = express.Router();
const precioServicioController = require("../controllers/precioServiciosController");

router.post("/precio-servicio", precioServicioController.crearPrecioServicio);
router.put("/precio-servicio/:profesional/:servicio", precioServicioController.actualizarPrecioServicio);
router.get("/precio-servicios", precioServicioController.obtenerPrecioServicio);

module.exports = router
