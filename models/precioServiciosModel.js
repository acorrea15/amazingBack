const mongoose = require("mongoose");
const { Schema } = mongoose;

const precioServiciosSchema = new Schema({
  servicio: { type: String, required: true },
  precio: { type: Number, required: true },
  profesional: { type: String, required: true },
}, { versionKey: false });

module.exports = mongoose.model("PrecioServicios", precioServiciosSchema);
