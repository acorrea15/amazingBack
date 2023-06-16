const fetch = require("node-fetch");

console.log("Eliminar cuando se configure Turnos Rutas")
const nodemailer = require("nodemailer");

const router = require('express').Router();
const Appointment = require('../models/turnosSchema');
const User = require('../models/userSchema');
/* const transporter = require('../config/mailer'); */
//const moment = require("moment");
const moment = require('moment-timezone');
moment.tz.setDefault('America/Argentina/Buenos_Aires');

const CLIENT_ID = process.env.CLIENT_ID 
const CLIENT_SECRET = process.env.CLIENT_SECRET
const REDIRECT_URI = process.env.REDIRECT_URI
const REFRESH_TOKEN = process.env.REFRESH_TOKEN

const { google } = require('googleapis');
const { OAuth2Client } = require('google-auth-library');

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

// crea un nuevo objeto `Date`
const today =  new Date();
const currentDate = today.toISOString().split('T')[0]

async function getAccessTokenWithRefreshToken(refreshToken) {
  const tokens = await oAuth2Client.refreshToken(refreshToken);
  return tokens.tokens.access_token; 
}

async function createCalendarEvent(appointmentDay, appointmentHourLs, appointmentServiceLs, email) {
  let duracion_evento 
  if (appointmentServiceLs==="Diseño y perfilado de cejas"){
    duracion_evento =  20 * 60000
  }
  if (appointmentServiceLs==="Diseño y perfilado + alisado de cejas"){
    duracion_evento =  60 * 60000
  }
  if (appointmentServiceLs==="Alisado de cejas"){
    duracion_evento =  40 * 60000
  }

  
  const accessToken = await getAccessTokenWithRefreshToken(REFRESH_TOKEN);
  console.log(accessToken, '<<<----Access token ya!!!!!!!!'); 

  const fechaString = appointmentDay + " " + appointmentHourLs; // fecha en formato DD/MM/YYYY hh:mm
  const appointmentDayStart = moment(
    fechaString,
    "DD/MM/YYYY HH:mm"
  ).toDate();
  const appointmentDayEnd = new Date(
    appointmentDayStart.getTime() + duracion_evento // 20 * 60000
  );

  const event = {
    summary: "Turno para " + appointmentServiceLs,
    description:
      "Turno en Amazing el servicio de " +
      appointmentServiceLs +
      " el día " +
      appointmentDayStart.toLocaleDateString(),
    start: {
      dateTime: appointmentDayStart.toISOString(), // Date.toISOString() ->
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //
    },
    end: {
      dateTime: appointmentDayEnd.toISOString(), // Date.toISOString() ->
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone, //
    },
    attendees: [
      /*{ email: 'acorreacen2@gmail.com' },*/ /*Aquí debe ir el mail amazinglooktuc@gmail.com !!!!!!!!!!!!!!!!!!!!*/
      { email: email } /*email de quien pide turno*/
    ] 
  };

    
  await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/primary/events",
    {
      method: "POST",
      headers: {
        Authorization: "Bearer " + accessToken, //session.provider_token, // Access token for google
      },
      body: JSON.stringify(event),
    }
  )
    .then((data) => {
      console.log(data, "<<<<<----data.json() OK")
      return data.json();
    })
    .then((data) => {
      //console.log(data, "<<<<<----data.json() ERROR")
    });
}


async function enviarMail(name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId, sendEmail, dni, id_turnos) {
  console.log(email,sendEmail, "(email,sendEmail, Antes de envío mail")
  // create reusable transporter object using the default SMTP transport
  if(sendEmail===true){
    let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: process.env.MAIL_USERNAME, // generated ethereal user
      pass: process.env.MAIL_PASSWORD,      // generated ethereal password
    },
    });

    transporter.verify().then( ()=>{
      console.log("LISTO PARA MANDAR MAIL")
    })
    
    // send mail with defined transport object
    const info = await transporter.sendMail({ 
      //from: "Amazing Look <amazinglooktuc@gmail.com>", // sender address
      from: "Amazing Look <studio@amazinglook.com.ar>", // sender address
      to: email, // list of receivers
      subject: `TURNO CONFIRMADO!`, // Subject line
       
      html: `<h5>Hola, ${name}! </h5>
             <p>Tu turno para el día ${appointmentDay} de ${appointmentServiceId}${appointmentServiceId !== 'Alisado de cejas' ? ` con  ${professional==="0" ? "Lulú" : "Martu"}`  : ' ' } a las ${appointmentHour} hs ya está confirmado.<p/>
             <p> <p/>
             <p>En caso de no poder asistir, por favor cancela el turno <a href="https://amazinglook.com.ar/appointment/${id_turnos}/${appointmentServiceId}/cancel">tocando aquí</a> <p/>
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

    /*Creo el evento en calendar*/
    createCalendarEvent(appointmentDay, appointmentHour, appointmentServiceId, email)
  }    
}

function formatStringToDate(text) {
  const myDate = text.split('/');
  return (new Date(myDate[2], myDate[1] - 1, myDate[0])).toISOString().split('T')[0]  
}
 

//get Appointment;
router.get('/', async(req, res)=> {
  try {
    const today =  new Date();
    const currentDate = today.toISOString().split('T')[0]
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

    const appointmentFound = await Appointment.find({ appointmentServiceId: appointmentServiceId, appointmentDay: appointmentDay, appointmentHour: appointmentHour, sendEmail: true } )
    
    if(appointmentFound.length>0){
      return res.status(401).json("El turno ya no está disponible. Por favor, seleccione otro horario.");
    }

    if (appointmentServiceId==="Alisado de cejas"){
      //Es un turno para el servicio 3 ("Alisado de cejas")
      
      //Busco si existe un turno para el mismo horario seleccionado para el service 2 ("Diseño y perfilado + alisado de cejas")
      const appointmentServiceIdPerfilMasAlisado="Diseño y perfilado + alisado de cejas"
      const appointmentFoundService2 = await Appointment.find({ appointmentServiceId: appointmentServiceIdPerfilMasAlisado, appointmentDay: appointmentDay, appointmentHour: appointmentHour, sendEmail: true } )
 
      if(appointmentFoundService2.length>0){
        return res.status(401).json("El turno ya no está disponible. Por favor, seleccione otro horario.");
      }
      else{
        const appointmentDayDate = formatStringToDate(appointmentDay);
    
        const appointmentService3 = await Appointment.create({name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentDayDate, appointmentServiceId, dni, id_turnos, sendEmail});
        let  appointmentServiceId="Diseño y perfilado + alisado de cejas"
        const appointmentService2 = await Appointment.create({name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentDayDate, appointmentServiceId, dni, id_turnos});
        appointmentServiceId="xxx xxx"
        const appointmentService1 = await Appointment.create({name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentDayDate, appointmentServiceId, dni, id_turnos});

        const today =  new Date();
        const currentDate = today.toISOString().split('T')[0]
        
        const sort = {'appointmentDayDate': 1, 'appointmentHour': 1}
        const appointments = await Appointment.find({ appointmentDayDate: { $gte: currentDate } } ).sort(sort); 
        
        enviarMail(name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId, sendEmail, dni, id_turnos);
        
        
        
        
        res.status(201).json(appointments); 
      }
      
    }

    if (appointmentServiceId==="Diseño y perfilado + alisado de cejas"){
      //Es un turno para el servicio 2 ("Diseño y perfilado + alisado de cejas")
      
      //Busco si existe un turno para service3 ("Alisado de cejas") para el mismo horario seleccionado para el service 2 ("Diseño y perfilado + alisado de cejas")
      const appointmentServiceIdAlisado="Alisado de cejas"
      const appointmentFoundService3 = await Appointment.find({ appointmentServiceId: appointmentServiceIdAlisado, appointmentDay: appointmentDay, appointmentHour: appointmentHour, sendEmail: true } )
 
      if(appointmentFoundService3.length>0){
        return res.status(401).json("El turno ya no está disponible. Por favor, seleccione otro horario.");
      }

      //Busco si existe un turno para service1 ("Diseño y perfilado de cejas") para 40 minutos después del horario seleccionado para el service 2 ("Diseño y perfilado + alisado de cejas")
      const hora = appointmentHour;
      const minutos = 40; 
      const [horaStr, minutoStr] = hora.split(':');
      const horaActual = new Date();
      horaActual.setHours(horaStr);
      horaActual.setMinutes(minutoStr);
      horaActual.setMinutes(horaActual.getMinutes() + minutos);
      const appointmentHourService1 = horaActual.toTimeString().slice(0, 5);     
     
      const appointmentServiceIdPerfilado = "Diseño y perfilado de cejas"
      const appointmentFoundService1 = await Appointment.find({ appointmentServiceId: appointmentServiceIdPerfilado , appointmentDay: appointmentDay, appointmentHour: appointmentHourService1, sendEmail: true } )
      
      if(appointmentFoundService1.length>0){
        return res.status(401).json("El turno ya no está disponible. Por favor, seleccione otro horario."); 
      }
    }

    if (appointmentServiceId==="Diseño y perfilado de cejas"){
      //Es un turno para el servicio 1 ("Diseño y perfilado de cejas")
     
      //Busco si existe un turno para service2 ("Diseño y perfilado + alisado de cejas") para 40 minutos antes del horario seleccionado para el service 1 ("Diseño y perfilado de cejas")
      const hora = appointmentHour;
      const minutos = 40; 
      const [horaStr, minutoStr] = hora.split(':');
      const horaActual = new Date();
      horaActual.setHours(horaStr);
      horaActual.setMinutes(minutoStr);
      horaActual.setMinutes(horaActual.getMinutes() - minutos);
      const appointmentHourService2 = horaActual.toTimeString().slice(0, 5);     
     
      const appointmentServiceIdPerfilado = "Diseño y perfilado de cejas"
      const appointmentFoundService2 = await Appointment.find({ appointmentServiceId: appointmentServiceIdPerfilado , appointmentDay: appointmentDay, appointmentHour: appointmentHourService2, sendEmail: true } )
      
      if(appointmentFoundService2.length>0){
        return res.status(401).json("El turno ya no está disponible. Por favor, seleccione otro horario."); 
      }
    }
    
    
  /*   const appointmentDayDate = formatStringToDate(appointmentDay);
    
    const appointment = await Appointment.create({name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentDayDate, appointmentServiceId, dni, id_turnos, sendEmail});
    
    const today =  new Date();
    const currentDate = today.toISOString().split('T')[0]
    
    const sort = {'appointmentDayDate': 1, 'appointmentHour': 1}
    const appointments = await Appointment.find({ appointmentDayDate: { $gte: currentDate } } ).sort(sort); 
    
    enviarMail(name, lastName, email, phone, professional, appointmentDay, appointmentHour, appointmentServiceId, sendEmail, dni, id_turnos);
    
    res.status(201).json(appointments); */
   
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
    const today =  new Date();
    const currentDate = today.toISOString().split('T')[0]     
        
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