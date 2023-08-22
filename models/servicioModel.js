const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  // Otros campos relacionados al servicio
});

const Servicio = mongoose.model("Servicio", servicioSchema);

module.exports = Servicio;