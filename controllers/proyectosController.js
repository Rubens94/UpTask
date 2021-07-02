const Proyectos = require('../models/Proyectos');
const Tareas = require('../models/Tareas');


const proyectosHome = async(req, res) => {  

    // console.log(res.locals.usuario);
    const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
    const proyectos = await Proyectos.findAll({ where: {usuarioId}}); // Mostrar unicamente los proyectos del usuario logueado

    res.render('index', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Proyectos',
        proyectos
    });
}


const formularioProyecto = async(req, res) => {
   
    const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
    const proyectos = await Proyectos.findAll({ where: {usuarioId}}); // Mostrar unicamente los proyectos del usuario logueado

    res.render('nuevoProyecto', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Nuevo Proyecto',
        proyectos
    });
}

const nuevoProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
    const proyectos = await Proyectos.findAll({ where: {usuarioId}}); // Mostrar unicamente los proyectos del usuario logueado
    // Enviar a consola los datos
    // console.log(req.body);

    // Validar que el input tenga algo
    const { nombre } = req.body;

    let errores = [];
    if ( !nombre ){
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    // Si hay errores 
    if (errores.length > 0){
        res.render('nuevoPRoyecto', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else{

        // Insertar en BD
        const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
        await Proyectos.create({ nombre, usuarioId });
        res.redirect('/');
            
    }
}

const proyectoPorUrl = async(req, res, next) => {

    const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
    const proyectosPromise = Proyectos.findAll({ where: {usuarioId}}); // Mostrar unicamente los proyectos del usuario logueado

    const proyectoPromise = Proyectos.findOne({
        where: {
            url: req.params.url,
            usuarioId
        }
    });

    const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]); // Generar una promesa para mejorar el performance de la app

    // Consultar tareas de proyecto actual
    const tareas = await Tareas.findAll({
        where: {
            proyectoId: proyecto.id
        },
        // Como hacer un populate en mongoose pero en Sequelize
        /* include: [
            {model: Proyectos}
        ] */
    });

    if( !proyecto) return next();
    
    // render a la vista
    res.render('tareas', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Tareas del Proyecto',
        proyecto,
        proyectos,
        tareas
    });
}


const formularioEditar = async(req, res) => {

    const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
    const proyectosPromise = Proyectos.findAll({ where: {usuarioId}}); // Mostrar unicamente los proyectos del usuario logueado

    const proyectoPromise = Proyectos.findOne({
        where: {
            id: req.params.id,
            usuarioId
        }
    });

    const [ proyectos, proyecto ] = await Promise.all([ proyectosPromise, proyectoPromise ]); // para mejorar el performance de la app, aquí se desectructuran las promesas

    // Render a la vista
    res.render('nuevoProyecto', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
        nombrePagina: 'Editar Proyecto',
        proyectos,
        proyecto
    });
}

const actualizarProyecto = async(req, res) => {

    const usuarioId = res.locals.usuario.id; // Sacar el ID del usuario para hacer la referencia del usuario quien guarde el proyecto
    const proyectosPromise = Proyectos.findAll({ where: {usuarioId}}); // Mostrar unicamente los proyectos del usuario logueado

    // Enviar a consola los datos
    // console.log(req.body);

    // Validar que el input tenga algo
    const { nombre } = req.body;

    let errores = [];
    if ( !nombre ){
        errores.push({'texto': 'Agrega un nombre al proyecto'});
    }

    // Si hay errores 
    if (errores.length > 0){
        res.render('nuevoPRoyecto', {  // lo que va entre comillas es el nombre del archivo pug en las vistas pero sin la extención
            nombrePagina: 'Nuevo Proyecto',
            errores,
            proyectos
        });
    } else{

        // Actualizar registro en BD
        await Proyectos.update(
            { nombre: nombre },
            { where: {id: req.params.id} }
        );
        res.redirect('/');
            
    }
}

const defaultValue = async(req, res, next) => {
    const proyectos = await Proyectos.findAll();
    const url = req.params.url;
   

    if ( proyectos.url !== url ) {
        res.status(404).send('Página no existe');
    } else {

        next();
    }
}

const eliminarProyecto = async(req, res, next) => {

    // Ver los datos que se mandan por req
    //console.log(req);

    // ver los datos que se mandan por req.params
    //console.log(req.params);

    // Ver los datos que se mandan por req.query
    //console.log(req.query);

    const {urlProyecto} = req.query;

    const resultado = await Proyectos.destroy({where: {url: urlProyecto} });

    if ( !resultado ) return next();
    
    res.status(200).send('Proyecto eliminado correctamente');
}

const cambiarEstadoTarea = async(req, res) => {
    
    const { id } = req.params;
    const tarea = await Tareas.findOne({ where: { id }});

    //Cambiar el estado
    let estado = 0;
    if( tarea.estado === estado) {
        estado = 1;
    }

    tarea.estado = estado; // cambia el estado de 1 a 0

    const resultado = await tarea.save();

    if( !resultado ) return next();

    res.status(200).send('Actualizado');

}

module.exports = {
    proyectosHome,
    formularioProyecto,
    nuevoProyecto,
    proyectoPorUrl,
    formularioEditar,
    actualizarProyecto,
    eliminarProyecto,
    cambiarEstadoTarea,
    defaultValue,
}