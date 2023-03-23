const dotenv = require("dotenv").config();

const config = {
    appConfig: {
        host: process.env.APP_HOST,
        port: process.env.APP_PORT, 
    },
    dbConfig: { 
        host: process.env.DB_HOST,
        portName: process.env.DB_PORT,
        dbName: process.env.DB_NAME,
    }
}

module.exports = config