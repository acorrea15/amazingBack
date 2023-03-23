console.log("Eliminar cuando se configure Professional Schema");

const mongoose = require('mongoose');
const ProfessionaltSchema = mongoose.Schema({  
     name: {
        type: String,
        required: [true, 'is required']
      },
    
      lastName: {
        type: String,
        required: [true, 'is required'],
        index: true
      },

      address: {        
        type: String,
        required: [true, 'is required']
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
        type: Number,
        required: [true, 'is required']
      },

      specialty: {
        type: String,
        required: [true, 'is required']
      },

      admissionDate: {
        type: Date, /*2023-02-14T21:26:22.854Z*/
        /* default: Date.now  */
        default: new Date().toISOString().split('T')[0]
        /* required: [true, 'is required'] */
      },

      picture: {
        type: String /* ,
        required: true */
      }


  }, {minimize: false});
  
  const Professional = mongoose.model('Professional', ProfessionaltSchema);
  
  module.exports = Professional;