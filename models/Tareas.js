const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos'); // Importar el modelo donde se relacionará la llave foránea


const Tareas = db.define('tareas', {
    id: {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    tarea: Sequelize.STRING(100),
    estado: Sequelize.INTEGER(1)
});
Tareas.belongsTo(Proyectos); // Una tarea o varias tareas pertenecen a un proyecto (modelo ER), crear llave foránea

module.exports = Tareas;