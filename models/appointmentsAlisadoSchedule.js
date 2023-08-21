const mongoose = require('mongoose'); 
const AppointmentAlisadoScheduleSchema = mongoose.Schema({  
 
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
  
  const AppointmentAlisadoSchedule = mongoose.model('AppointmentAlisadoSchedule', AppointmentAlisadoScheduleSchema);
  
  module.exports = AppointmentAlisadoSchedule;