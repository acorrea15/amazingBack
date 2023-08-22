const ProfesionalController = require('../models/profesionalModel');

const getProfesionales = async (req, res) => {
    try {
        const profesionales = await ProfesionalController.find();
        res.status(200).json(profesionales);
    } catch (error) {
        res.status(400).send(error.message);
    }
    }

const createProfesional = async (req, res) => {
    try {
        const { nombre } = req.body;
        const nuevoProfesional = new ProfesionalController({
            nombre
        });
        const profesional = await nuevoProfesional.save();
        res.status(201).json(profesional);
    } catch (error) {
        res.status(400).json("Error al crear el profesional");
    }
}

module.exports = {
    getProfesionales,
    createProfesional
}
