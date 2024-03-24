const Servicio = require("../models/servicioModel");

const getServicios = async (req, res) => {
  try {
    const servicios = await Servicio.find();
    res.status(200).json(servicios);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createServicio = async (req, res) => {
  try {
    const { nombre, costo } = req.body;
    const nuevoServicio = new Servicio({
      nombre,
      costo,
    });
    const servicio = await nuevoServicio.save();
    res.status(201).json(servicio);
  } catch (error) {
    res.status(400).json("Error al crear el servicio");
  }
};

module.exports = {
  getServicios,
  createServicio,
};
