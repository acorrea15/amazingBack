const express = require('express')
const app = express()
const cors = require('cors')
const { appConfig, dbConfig } = require('./config')
const   connectDb   = require('./db/mongodb.js')
//rutas
const userRoutes = require('./rutas/user.rutas')
const turnosRoutes = require('./rutas/turnos.rutas')
const appointmentsscheduleRoutes = require('./rutas/appointmentsSchedule.rutas')
const professionalsRoutes = require('./rutas/professional.rutas')

// Middlewares
app.use(cors())
app.use(express.json())

app.use('/users', userRoutes);
app.use('/appointments', turnosRoutes);
app.use('/appointmentsschedule', appointmentsscheduleRoutes);
app.use('/professionals', professionalsRoutes);


const initApp = async (appConfig, dbConfig) => {
    try{ 
      await connectDb(dbConfig);
      app.listen(appConfig.port, () => {
        console.log(`Servidor corriendo en puerto ${appConfig.port}`);
      });
    }catch(error){
      console.log(error);
      process.exit(0) // termina el proceso
    }
  }
  
  initApp(appConfig, dbConfig);

