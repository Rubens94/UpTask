const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');

const agregarTarea = async(req, res, next) => {

    // Obtener proyecto actual
    const proyecto = await Proyectos.findOne({where: {url: req.params.url}});

    // Leer valor del input
    const {tarea} = req.body;

    // Estado 0 = incompleto e ID del proyecto
    const estado = 0;
    const proyectoId = proyecto.id;

    // Insertar en la BD
    const resultado = await Tareas.create({ tarea, estado, proyectoId });

    if( !resultado ) return next();

    // Redireccionar
    res.redirect(`/proyectos/${req.params.url}`);
}

const eliminarTarea = async(req, res) => {

    const { id } = req.params;

    const resultado = await Tareas.destroy({where: { id} });

    if (!resultado) return next();

    res.status(200).send('Tarea Eliminada Correctamente');
}

module.exports = {
    agregarTarea,
    eliminarTarea
}