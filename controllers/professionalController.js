const ProfesionalController = require("../models/profesionalModel");

const getProfesionales = async (req, res) => {
  try {
    const profesionales = await ProfesionalController.find();
    res.status(200).json(profesionales);
  } catch (error) {
    res.status(400).send(error.message);
  }
};

const createProfesional = async (req, res) => {
  console.log(req.body);
  try {
    const { nombre, lastName, address, email, phone, specialty } = req.body;
    const nuevoProfesional = new ProfesionalController({
      nombre,
      lastName,
      address,
      email,
      phone,
      specialty,
    });
    const profesional = await nuevoProfesional.save();
    res.status(201).json(profesional);
  } catch (error) {
    res.status(400).json("Error al crear el profesional");
  }
};

//Delete Professional

const deleteProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const profesional = await ProfesionalController.findByIdAndDelete(id);
    res
      .status(200)
      .json(`Profesional: ${profesional.nombre} eliminado correctamente`);
  } catch (error) {
    res.status(400).json("Error al eliminar el profesional");
  }
};

// Editar profesional

const updateProfesional = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, lastName, address, email, phone, specialty } = req.body;
    const profesional = await ProfesionalController.findByIdAndUpdate(
      id,
      { nombre, lastName, address, email, phone, specialty },
      { new: true }
    );
    res.status(200).json(profesional);
  } catch (error) {
    res.status(400).json("Error al actualizar el profesional");
  }
};

module.exports = {
  getProfesionales,
  createProfesional,
  deleteProfesional,
  updateProfesional,
};
