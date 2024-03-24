const mongoose = require("mongoose");

const profesionalSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    specialty: [{ type: String, required: true }],
  },
  { versionKey: false }
);

const Profesional = mongoose.model("Profesional", profesionalSchema);

module.exports = Profesional;
