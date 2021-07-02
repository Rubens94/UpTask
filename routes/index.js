const express = require('express');
const router = express.Router();
const { check } = require('express-validator');



// Importar controlador
const {proyectosHome,
       formularioProyecto,
       nuevoProyecto,
       proyectoPorUrl,
       formularioEditar,
       actualizarProyecto,
       eliminarProyecto,
       cambiarEstadoTarea,
       defaultValue
} = require('../controllers/proyectosController');

const {
    formCrearCuenta,
    crearCuenta,
    formIniciarSesion,
    formRestablecerPassword,
    confirmarCuenta
} = require('../controllers/usuariosController');

const {
    agregarTarea,
    eliminarTarea
} = require('../controllers/tareasCrontroller');

const { autenticarUsuario, usuarioAutenticado, cerrarSesion, enviarToken, validarToken, actualizarPassword } = require('../controllers/authController');



module.exports = function() {

    // Ruta para el home
    router.get('/', [usuarioAutenticado], proyectosHome );

    router.get('/nuevo-proyecto', [usuarioAutenticado], formularioProyecto );

    router.post('/nuevo-proyecto', [
        check('nombre', 'El nombre no puede estar vacío').not().isEmpty().trim().escape(), // trim elimina espacios vacios al final e inicio y escape para quitar caracteres especiales
        usuarioAutenticado 
    ], nuevoProyecto);
    
    // router.get('*', defaultValue );

    //Listar proyectos
    router.get('/proyectos/:url', [usuarioAutenticado], proyectoPorUrl);

    // Actualizar el proyecto
    router.get('/proyecto/editar/:id', 
    formularioEditar);
    router.post('/nuevo-proyecto/:id', [
        check('nombre', 'El nombre no puede estar vacío').not().isEmpty().trim().escape(), // trim elimina espacios vacios al final e inicio y escape para quitar caracteres especiales
        usuarioAutenticado 
    ], actualizarProyecto);

    // Eliminar proyecto
    router.delete('/proyectos/:url', [usuarioAutenticado], eliminarProyecto);

    // Tareas
    router.post('/proyectos/:url', [usuarioAutenticado], agregarTarea);

    // Actualizar tarea
    // patch solo reescribe un campo de la BD
    router.patch('/tareas/:id', [usuarioAutenticado], cambiarEstadoTarea );

    // Eliminar tarea
    router.delete('/tareas/:id', [usuarioAutenticado], eliminarTarea );

    // Crear nueva cuenta
    router.get('/crear-cuenta', formCrearCuenta)
    router.post('/crear-cuenta', [
        check('email', 'El correo no puede estar vació').not().isEmpty(),
        check('password', 'El password no puede estar vació').not().isEmpty()
    ], crearCuenta);
    router.get('/confirmar/:correo', confirmarCuenta);

    // Iniciar sesión
    router.get('/iniciar-sesion', formIniciarSesion );
    router.post('/iniciar-sesion', autenticarUsuario);

    // Cerrar sesión
    router.get('/cerrar-sesion', cerrarSesion);

    // Reestablecer contraseña
    router.get('/reestablecer', formRestablecerPassword);
    router.post('/reestablecer', enviarToken);
    router.get('/reestablecer/:token', validarToken);
    router.post('/reestablecer/:token', actualizarPassword);

    return router;
}