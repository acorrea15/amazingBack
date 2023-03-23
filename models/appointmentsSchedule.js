console.log("Eliminar cuando se configure Turnos Cronograma");

const mongoose = require('mongoose');
const AppointmentScheduleSchema = mongoose.Schema({  
 
      appointmentDay: {
        type: String, /*Monday, Tuesday...*/
        required: [true, 'is required']
      },

      isEnabled: {
        type: Boolean,
        default: false
      },
    
      appointmentTimes: {
        type: Array,
        required: [true, 'is required']        
      },
        
      
      
  }, {minimize: false});
  
  const AppointmentSchedule = mongoose.model('AppointmentSchedule', AppointmentScheduleSchema);
  
  module.exports = AppointmentSchedule;