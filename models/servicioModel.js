const mongoose = require("mongoose");

const servicioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  costo: { type: Number, required: true },
}, { versionKey: false });

const Servicio = mongoose.model("Servicio", servicioSchema);

module.exports = Servicio;