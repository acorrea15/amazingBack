const mongoose = require("mongoose");

const precioServicioSchema = new mongoose.Schema({
  profesional: { type: String, required: true }, // Cambiado a String
  servicio: { type: String, required: true },   // Cambiado a String
  costo: { type: Number, required: true },
});

const PrecioServicio = mongoose.model("PrecioServicio", precioServicioSchema);

module.exports = PrecioServicio;