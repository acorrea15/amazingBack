
const express = require("express");
const router = express.Router();
const precioServicioController = require("../controllers/precioServiciosController");

router.post("/precio-servicio", precioServicioController.crearPrecioServicio);
router.put("/precio-servicio/:profesional/:servicio", precioServicioController.actualizarPrecioServicio);
router.get("/precio-servicios", precioServicioController.obtenerPrecioServicio);
router.delete("/precio-servicio/:id", precioServicioController.eliminarPrecioServicio);

module.exports = router
