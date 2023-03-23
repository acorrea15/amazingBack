console.log("Eliminar cuando se configure Turnos Schema");

const mongoose = require('mongoose');
const AppointmentSchema = mongoose.Schema({  
    name: {
        type: String,
        required: [true, 'is required']
      },
    
      lastName: {
        type: String,
        required: [true, 'is required'],
        index: true
      },
    
      email: {
        type: String,
        required: [true, 'is required'],
       /*unique: true,*/
        index: true,
        validate: {
          validator: function(str){
            return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(str);
          },
          message: props => `${props.value} is not a valid email` 
        }
      },
    
      phone: {
        type: Number ,
        required: [true, 'is required']
      },

      professional: {
        type: String,
        required: [true, 'is required']
      },
     
      appointmentDay: {
        type: String, /* 25/3/2023 */
        required: [true, 'is required'] 
      },  
       
      appointmentHour: {
        type: String, /* 17:00 */
        required: [true, 'is required'] 
      }, 

      appointmentDayDate: {
        type: Date,  
        required: [true, 'is required'] 
      }, 

      appointmentServiceId: {
        type: String, /* service1: Diseño y perfilado de cejas, service2: Diseño y perfilado + alisado de cejas*/
        required: [true, 'is required'] 
      },

      dni: {
        type: String, 
        required: [true, 'is required'] 
      },

      id_turnos: {
        type: String,
        required: [true, 'is required']
      },  
      
      
  }, {minimize: false});
  
  const Appointment = mongoose.model('Appointment', AppointmentSchema);
  
  module.exports = Appointment;