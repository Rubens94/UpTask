const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const Sequelize = require('sequelize');
const Op = Sequelize.Op; // Operadores avanzados de Sequelize
const crypto = require('crypto'); // Generar token
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handlers/email');


const autenticarUsuario = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/iniciar-sesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
});

// Función para revisar si el usuario esta logueado o no
const usuarioAutenticado = (req, res, next) => {

    // Si esta autenticado, adelante
    if( req.isAuthenticated()) {
        return next();
    }
    // sino esta autenticado, redirigir al formulario
    return res.redirect('/iniciar-sesion');
}

// Cerrar sesión
const cerrarSesion = (req, res) => {
    req.session.destroy( () => {
        res.redirect('/iniciar-sesion'); // Redirigir a iniciar sesión 
    })
}

// Enviar un token si el usuario es válido
const enviarToken = async(req, res) => {

    // Verificar que el usuario Existe
    const {email} = req.body
    const usuario = await Usuarios.findOne({where: { email }});
    // Si no existe el usuario
    if(!usuario) {
        req.flash('error', 'No existe esa cuenta');
        res.render('reestablecer', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
            mensajes: req.flash(),
            nombrePagina: 'Reestablecer tu contraseña'
        });
    }

    // Usuario existe
    // Generar token
    usuario.token = crypto.randomBytes(20).toString('hex');

    // Expiración del token
    usuario.expiracion = Date.now() + 3600000 // La expirasión se pone en segundos (1 hora);

    // Guardar en la BD
    await usuario.save();

    // url reset
    const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`; // URL para restablecer contraseña

    //console.log(resetUrl);

    // Enviar correo con el token
    await enviarEmail.enviar({
        usuario,
        subject: 'Password Reset',
        resetUrl,
        archivo: 'reestablece-password'
    });

    // Terminar ejecución
    req.flash('correcto', 'Se envió un mensaje a tu correo');
    res.render('iniciarSesion', {
        mensajes: req.flash(),
        nombrePagina: 'Iniciar Sesión en UpTask'
    });
}


const validarToken = async(req, res) => {

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token
        }
    });
    

    // sino encuentra el usuario
    if(!usuario) {
        req.flash('error', 'Token No Válido');
        res.render('reestablecer', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
            mensajes: req.flash(),
            nombrePagina: 'Reestablecer tu contraseña'
        });
    }

    // Formulario para generar el password
    res.render('resetPassword', {
        nombrePagina: 'Reestablecer Contraseña'
    });
   
}

// Cambiar el password por uno nuevo
const actualizarPassword = async(req, res) => {

    // Verifica el token válido pero también la fecha de expiración

    const usuario = await Usuarios.findOne({
        where: {
            token: req.params.token,
            expiracion: {
                [Op.gte] : Date.now() 
            }
        }
    });

    // Verificar si existe usuario
    if ( !usuario ) {
        req.flash('error', 'Token No Válido');
        res.render('reestablecer', {
            mensajes: req.flash(),
            nombrePagina: 'Iniciar Sesión en UpTask'
        });
    }

    // Encriptar password

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10) ); // Encriptar contraseña con Sequelize
    usuario.token = null; // Borra el token
    usuario.expiracion = null; // Borra la fecha de expiración

    // Guardar en la BD
    await usuario.save();

    //res.redirect('/iniciar-sesion');
    
    req.flash('correcto', 'Tu password se ha modificado correctamente');
    res.render('iniciarSesion', {
        mensajes: req.flash(),
        nombrePagina: 'Iniciar Sesión en UpTask'
    });
}

module.exports = {
    autenticarUsuario,
    usuarioAutenticado,
    cerrarSesion,
    enviarToken,
    validarToken,
    actualizarPassword
}