const mongoose = require("mongoose");

const precioServicioSchema = new mongoose.Schema({
  // profesional: { type: mongoose.Schema.Types.ObjectId, ref: "Profesional", required: true },
  // servicio: { type: mongoose.Schema.Types.ObjectId, ref: "Servicio", required: true },
  // costo: { type: Number, required: true },
  profesional: { type: String, required: true }, // Cambiado a String
  servicio: { type: String, required: true },   // Cambiado a String
  costo: { type: Number, required: true },
});

const PrecioServicio = mongoose.model("PrecioServicio", precioServicioSchema);

module.exports = PrecioServicio;