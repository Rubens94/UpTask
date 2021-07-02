const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Referencia al modelo donde vamos a autenticar
const Usuarios = require('../models/Usuarios');

// Local strategy - Login con credenciales propias (usuario y password)
passport.use(
    new LocalStrategy(
        {
            // Por default passport espera un usuario y password
            usernameField: 'email', // el nombre debe ser el mismo que en la BD en la tabla de usuarios
            passwordField: 'password' // el nombre debe ser el mismo que en la BD en la tabla de usuarios

        },
        async (email, password, done) => {
            try{
                // Buscar email en la BD
                const usuario = await Usuarios.findOne({
                    where: { 
                        email,
                        activo: 1 // Solo los usuarios activos pueden iniciar sesión
                    }
                });
                // El usuario existe pero password incorrecto
                if(!usuario.verificarPassword(password)) { // La función verificarPassword se define en el modelo de Usuario
                    return done(null, false, {
                        message : 'Password Incorrecto'
                    });
                }
                // EL email existe y el password es correcto
                return done(null, usuario);
            } catch (err) {
                // Ese usuario no existe
                return done(null, false, {
                    message : 'Esa cuenta no existe'
                })
            }
        }
    )
);

// serializar el usuario
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
});

// deserializar el usuario
passport.deserializeUser((usuario, callback) => {
    callback(null, usuario);
});

// exportar
module.exports = passport;