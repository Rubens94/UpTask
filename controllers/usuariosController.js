const { response } = require('express');
const Usuarios = require('../models/Usuarios');
const enviarEmail = require('../handlers/email');


const crypto = require('crypto'); // Generar token

const formCrearCuenta = (req, res = response) => {

    res.render('crearCuenta', { // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Crear Cuenta en Uptask'
    });
}

const crearCuenta = async(req, res = response) => {

    // Leer los datos
    const { email, password } = req.body;

    try {
        // Crear el usuario
        await Usuarios.create({
            email,
            password
        });

        // Crear una URL de confirmar
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`; // URL para restablecer contraseña

        // Crear el objeto de usuario
        const usuario = {
            email
        }

        // Enviar email
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta UpTask', 
            confirmarUrl, 
            archivo : 'confirmar-cuenta'
        });

        // Redirigir al usuario
        req.flash('correcto', 'Enviamos un mensaje a tu correo, confirma tu cuenta');
        res.render('iniciarSesion', {
        mensajes: req.flash(),
        nombrePagina: 'Iniciar Sesión en UpTask'
         });
        ;
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en Uptask', 
            email,
            password
        });
    }

    
}

const formIniciarSesion = (req, res = response) => {

    const {error} = res.locals.mensaes;

    res.render('iniciarSesion', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Iniciar Sesión en Uptask',
        error
    })
}

const formRestablecerPassword = (req, res) => {

    res.render('reestablecer', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Reestablecer tu contraseña'
    });
}

const confirmarCuenta = async(req, res = response) => {

    const usuario = await Usuarios.findOne({
        where: {
            email: req.params.correo
        }
    });

    // Sino existe el usuario
    if( !usuario ) {
        req.flash('error', 'No Válido');
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina: 'Crear Cuenta en UpTask'
        });
    }

    usuario.activo = 1;
    await usuario.save();


    req.flash('correcto', 'Cuenta creada correctamente');
    res.render('iniciarSesion', {
        mensajes: req.flash(),
        nombrePagina: 'Iniciar Sesión en UpTask'
    });
}

module.exports = {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    formRestablecerPassword,
    confirmarCuenta
}