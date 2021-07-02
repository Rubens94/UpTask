const  Sequelize  = require('sequelize');
                        // DB, user & password
const db = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT,
    timezone: '-05:00' // Zona horaria de México central
    // logging: false 'evitar que no se muestre todas las consultas en la terminal'
});

module.exports = db;