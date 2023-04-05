console.log("Eliminar cuando se configure Turnos Rutas")
const nodemailer = require("nodemailer");

const router = require('express').Router();
const Appointment = require('../models/turnosSchema');
const User = require('../models/userSchema');
/* const transporter = require('../config/mailer'); */


// crea un nuevo objeto `Date`
const today =  new Date();
const currentDate = today.toISOString().split('T')[0]

async function enviarMail(name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId, sendEmail, dni, id_turnos) {
  console.log(email,sendEmail, "(email,sendEmail, Antes de envío mail")
  // create reusable transporter object using the default SMTP transport
  if(sendEmail===true){
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME /* "acorreacen2@gmail.com" */, // generated ethereal user
      pass: process.env.MAIL_PASSWORD /* "gurqampfqvzvzwmi" */,      // generated ethereal password
    },
    });

    transporter.verify().then( ()=>{
      console.log("LISTO PARA MANDAR MAIL")
    })
    
    // send mail with defined transport object
    const info = await transporter.sendMail({
      from: "Amazing Look <amazinglooktuc@gmail.com>", // sender address
      to: email, // list of receivers
      subject: `TURNO CONFIRMADO!`, // Subject line
       
      html: `<h5>Hola, ${name}! </h5>
             <p>Tu turno para el día ${appointmentDay} de ${appointmentServiceId}${appointmentServiceId !== 'Alisado de cejas' ? ' con Lulú/Martu ' : ' ' }a las ${appointmentHour} hs ya está confirmado.<p/>
             <p> <p/>
             <p>En caso de no poder asistir, por favor cancela el turno <a href="https://amazing-admin.netlify.app/appointment/${id_turnos}/${appointmentServiceId}/cancel">tocando aquí</a> <p/>
             <p> <p/>
             <p>Atención a los siguientes ítems: <br /> 
             -> Contacto: 3812078796 <br />
             -> Dirección: Lobo de la Vega 202, Galeria Handicap L41 (Local frente al estacionamiento) <br />
             -> En caso de no poder asistir y no cancelar con al menos dos horas de anticipación, se deberá abonar el turno en su totalidad. <br />
             -> Rogamos puntualidad. El tiempo de tolerancia son 5' <p/>
             <p><p/>
             <p>¡Gracias! Te esperamos en Amazing<p/>
              
             `, // html body
        
    });

    console.log(email, "Después de envío mail")
  }    
}

function formatStringToDate(text) {
  const myDate = text.split('/');
  return (new Date(myDate[2], myDate[1] - 1, myDate[0])).toISOString().split('T')[0]  
}
 

//get Appointment;
router.get('/', async(req, res)=> {
  try {

    // crea un nuevo objeto `Date`
    const today =  new Date();
    console.log(today, "todayyyyyyyyyyyyyyy1")
    /* console.log(today.getHours()+":"+today.getMinutes(), "hora y minuto actual") */

    const currentDate = today.toISOString().split('T')[0]
    
 
    console.log(currentDate, "currentDate 1" )


    const sort = {'appointmentDayDate': 1, 'appointmentHour': 1}
    const appointments = await Appointment.find( { appointmentDayDate: { $gte: currentDate } } ).sort(sort); 
    res.status(200).json(appointments);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


//create appointment
router.post('/', async(req, res)=> {
  try {
    const {name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId, sendEmail, dni, id_turnos} = req.body;


    const appointmentFound = await Appointment.find({ appointmentServiceId: appointmentServiceId, appointmentDay: appointmentDay, appointmentHour: appointmentHour } )
    if(appointmentFound.length>0){
      return res.status(401).json("El turno ya no está disponible. Por favor, seleccione otro horario.");
    }
  

    
    const appointmentDayDate = formatStringToDate(appointmentDay);
    console.log(name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentDayDate, appointmentServiceId, dni, id_turnos, "dentro de create appointment")
    const appointment = await Appointment.create({name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentDayDate, appointmentServiceId, dni, id_turnos});
    
    const today =  new Date();
    const currentDate = today.toISOString().split('T')[0]
    
    const sort = {'appointmentDayDate': 1, 'appointmentHour': 1}
    const appointments = await Appointment.find({ appointmentDayDate: { $gte: currentDate } } ).sort(sort); 
    
    enviarMail(name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId, sendEmail, dni, id_turnos);
    
    res.status(201).json(appointments);
   
  } catch (e) {
    res.status(400).send(e.message);
  }
})


// update appointment
router.patch('/:id', async(req, res)=> {
  const {id} = req.params;
  try {
    const {name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId} = req.body;
    const appointment = await Appointment.findByIdAndUpdate(id, {name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId});
    const sort = {'appointmentDayDate': 1, 'appointmentHour': 1}
    const appointments = await Appointment.find({ appointmentDayDate: { $gte: currentDate } } ).sort(sort);
    res.status(200).json(appointments);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


// delete appointment
router.delete('/:id', async(req, res)=> {
  const {id} = req.params;
  const {user_id} = req.body;

  try {
    /* const user = await User.findById(user_id); */

    /* if(!user.isAdmin) return res.status(401).json("NO TIENE PERMISO DE ADMIN! NO PUEDE BORRAR TURNOS!"); */

    /* await Appointment.findByIdAndDelete(id); */
    await Appointment.deleteMany( { id_turnos: id } );
    const sort = {'appointmentDayDate': 1, 'appointmentHour': 1}
    const appointments = await Appointment.find({ appointmentDayDate: { $gte: currentDate } } ).sort(sort);
    res.status(200).json(appointments);
  } catch (e) {
    res.status(400).send(e.message);
  }
})


router.get('/:id', async(req, res)=> {
  const {id} = req.params;
  try {
    const appointment = await Appointment.findById(id);    
    res.status(200).json({appointment})
  } catch (e) {
    res.status(400).send(e.message);
  }
});



module.exports = router;