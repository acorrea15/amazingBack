console.log("Eliminar cuando se configure Turnos Rutas Schedule")

const router = require('express').Router();
const AppointmentAlisadoSchedule = require('../models/appointmentsAlisadoSchedule');  
const User = require('../models/userSchema');

 
 

//get Appointment Alisado Schedules;
router.get('/', async(req, res)=> {
  try {
    const sort = {'_id': -1} 
    const appointmentsAlisadoSchedule = await AppointmentAlisadoSchedule.find().sort(sort); 
    res.status(200).json(appointmentsAlisadoSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


//create appointment Alisado Schedule
router.post('/', async(req, res)=> {
  try {
    const {appointmentDay, appointmentTimes} = req.body;
    const appointmentAlisadoSchedule = await AppointmentAlisadoSchedule.create({appointmentDay, appointmentTimes});   
     
    const appointmentsAlisadoSchedule = await AppointmentAlisadoSchedule.find();
    res.status(201).json(appointmentsAlisadoSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


// update appointment Alisado
router.patch('/:id', async(req, res)=> {
  const {id} = req.params;
  try {
    const {isEnabled, appointmentTimes} = req.body;
    console.log(id, "id???")
    console.log(isEnabled, "isEnabled")
    console.log(appointmentTimes, "appointmentTimes")

    const appointmentAlisadoSchedule = await AppointmentAlisadoSchedule.findByIdAndUpdate(id, {isEnabled, appointmentTimes});
    
    const appointmentsAlisadoSchedule = await AppointmentAlisadoSchedule.find();
    res.status(200).json(appointmentsAlisadoSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


// delete appointment Alisado
router.delete('/:id', async(req, res)=> {
  const {id} = req.params;
  const {user_id} = req.body;

  try {
    const user = await User.findById(user_id);

    /* if(!user.isAdmin) return res.status(401).json("NO TIENE PERMISO DE ADMIN! NO PUEDE BORRAR ESQUEMAS DE TURNOS!"); */

    await AppointmentAlisadoSchedule.findByIdAndDelete(id);
     
    const appointmentsAlisadoSchedule = await AppointmentAlisadoSchedule.find();
    res.status(200).json(appointmentsAlisadoSchedule);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


router.get('/:id', async(req, res)=> {
  const {id} = req.params;
  try {
    const appointmentAlisadoSchedule = await AppointmentAlisadoSchedule.findById(id);    
    res.status(200).json({appointmentAlisadoSchedule})
  } catch (e) {
    res.status(400).send(e.message);
  }
});



module.exports = router;