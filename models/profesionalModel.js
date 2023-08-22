const mongoose = require("mongoose");

const profesionalSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  // Otros campos relacionados al profesional
});

const Profesional = mongoose.model("Profesional", profesionalSchema);

module.exports = Profesional;