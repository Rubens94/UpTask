const Sequelize = require('sequelize');
const slug  = require('slug');
const shortid = require('shortid');

const db = require('../config/db');

const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING(100),
    url: Sequelize.STRING(100)
}, {
    hooks: {
        beforeCreate( proyecto ) {
            const url = slug(proyecto.nombre).toLowerCase(); // Función de slug() sirve para generar el nombre de la url en base al nombre del proyecto 

            proyecto.url = `${url}-${shortid.generate()}`; // shortid.generate() crea una url unica agregando un ID
        }
    }
});

module.exports = Proyectos;