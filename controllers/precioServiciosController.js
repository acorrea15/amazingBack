const PrecioServicios = require("../models/precioServiciosModel");

const getPrecioServicios = async (req, res) => {
  try {
    const precioServicios = await PrecioServicios.find();
    res.status(200).json(precioServicios);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

const createPrecioServicios = async (req, res) => {
  try {
    const { servicio, precio, profesional } = req.body;
    const nuevoPrecioServicios = new PrecioServicios({
      servicio,
      precio,
      profesional,
    });
    const precioServicios = await nuevoPrecioServicios.save();
    res.status(201).json(precioServicios);
  } catch (e) {
    res.status(400).json("Error al crear el precio del servicio");
  }
};

const updatePrecioServicios = async (req, res) => {
    try {
      const id = req.params.id; // Obtén el id desde los parámetros de la URL
      const { precio } = req.body;
  
      // Utiliza el id para buscar y actualizar
      await PrecioServicios.findByIdAndUpdate(
        id,
        {
          precio, // Solo actualizamos el precio, ya que el servicio no cambia
        }
      );
  
      res.json("Precio actualizado");
    } catch (error) {
      res.status(400).json("Error al actualizar el precio del servicio");
    }
  };

module.exports = {
  getPrecioServicios,
  createPrecioServicios,
  updatePrecioServicios,
};
