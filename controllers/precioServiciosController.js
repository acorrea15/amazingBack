// const PrecioServicios = require("../models/precioServiciosModel");

// const getPrecioServicios = async (req, res) => {
//   try {
//     const precioServicios = await PrecioServicios.find();
//     res.status(200).json(precioServicios);
//   } catch (e) {
//     res.status(400).send(e.message);
//   }
// };

// const createPrecioServicios = async (req, res) => {
//   try {
//     const { servicio, precio, profesional } = req.body;
//     const nuevoPrecioServicios = new PrecioServicios({
//       servicio,
//       precio,
//       profesional,
//     });
//     const precioServicios = await nuevoPrecioServicios.save();
//     res.status(201).json(precioServicios);
//   } catch (e) {
//     res.status(400).json("Error al crear el precio del servicio");
//   }
// };

// const updatePrecioServicios = async (req, res) => {
//     try {
//       const id = req.params.id; // Obtén el id desde los parámetros de la URL
//       const { precio } = req.body;

//       // Utiliza el id para buscar y actualizar
//       await PrecioServicios.findByIdAndUpdate(
//         id,
//         {
//           precio, // Solo actualizamos el precio, ya que el servicio no cambia
//         }
//       );

//       res.json("Precio actualizado");
//     } catch (error) {
//       res.status(400).json("Error al actualizar el precio del servicio");
//     }
//   };

// module.exports = {
//   getPrecioServicios,
//   createPrecioServicios,
//   updatePrecioServicios,
// };

const PrecioServicio = require("../models/precioServiciosModel");
const Profesional = require("../models/profesionalModel"); // Asegúrate de usar la ruta correcta hacia el modelo
const Servicio = require("../models/servicioModel"); // Importa otros modelos si es necesario

const crearPrecioServicio = async (req, res) => {
  try {
    const { nombre, servicio, costo } = req.body;
    const profesional = await Profesional.findOne({ nombre });
    const servicioObj = await Servicio.findOne({ servicio });
    if (!profesional || !servicioObj) {
      return res.status(404).json("Profesional o servicio no encontrado");
    }

    const nuevoPrecio = new PrecioServicio({
      profesional: profesional.nombre,
      servicio: servicioObj.nombre,
      costo,
    });

    const precioGuardado = await nuevoPrecio.save();
    res.status(201).json(precioGuardado);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

const actualizarPrecioServicio = async (req, res) => {
  try {
    const nombreProfesional = req.params.profesional;
    const nombreServicio = req.params.servicio;
    const { costo } = req.body;

    await PrecioServicio.findOneAndUpdate(
      { profesional: nombreProfesional, servicio: nombreServicio },
      { costo }
    );

    res.json("Precio de servicio actualizado");
  } catch (error) {
    res.status(400).json("Error al actualizar el precio del servicio");
  }
};

const obtenerPrecioServicio = async (req, res) => {
  try {
    const precioServicios = await PrecioServicio.find();
    res.status(200).json(precioServicios);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = {
  crearPrecioServicio,
  actualizarPrecioServicio,
  obtenerPrecioServicio,
};
