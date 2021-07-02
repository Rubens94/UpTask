const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false, // Prohibir dejar campos vaciós
        validate: {
            isEmail: {
                msg: 'Agrega un correo válido'
            },
            notEmpty: {
                msg: 'No puede ir vació el email'
            }
        }, 
        unique: {
            args: true,
            msg: 'Correo ya registrado'
        }
    },
    password: {
        type: Sequelize.STRING(60), // El hash tendrá 60 caracteres
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'No puede ir vació el password'
            }
        }
    },
    activo: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expiracion: Sequelize.DATE
}, {
    hooks: {
        beforeCreate(usuario) {
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10) ); // Encriptar contraseña con Sequelize
        }
    }
});

// Métodos personalizados
Usuarios.prototype.verificarPassword = function(password) {
    return bcrypt.compareSync(password, this.password); // returna True o False dependiendo de la contraseña si es correcto o incorrecto
}

Usuarios.hasMany(Proyectos); // Los usuarios pueden crear multiples proyectos 

module.exports = Usuarios;