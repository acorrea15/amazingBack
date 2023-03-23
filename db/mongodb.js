const mongoose = require('mongoose')
const { dbConfig } = require('../config')
mongoose.set('strictQuery', true); 

mongoose.connection.on('open', () => console.log('Conexión a la base de datos establecida'))

const connectDb = async () => {
    const { host, portName, dbName } = dbConfig;
    const uri = process.env.MONGODB_URI  // `mongodb://${host}:${portName}/${dbName}`;
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true})
}

module.exports = connectDb 
