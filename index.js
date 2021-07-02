require('dotenv').config();
const express = require('express');
const routes = require('./routes');
const path = require('path');
const  db = require('./config/db');
const flash = require('connect-flash');
const session = require('express-session'); // permite ir a un usuario ir de una página a otra y mantener la sesión
const cookieParser = require('cookie-parser'); // autenticar usuarios
const passport = require('./config/passport');

port = process.env.PORT;

// Helpers con algunas funciones
const helpers = require('./helpers/helpers');

// Importar modelo
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

// Crear conexión a la BD
db.sync()
    .then(() => console.log('Conectado a la base de datos'))
    .catch(error => console.log(error));

// Crear una app de express
const app = express();

// Leer carpeta pública
app.use(express.static('public'));

// Habilitar pug
app.set('view engine', 'pug');

// Habilitar bodyParser para leer datos del formulario
app.use( express.urlencoded({extended: true}) );


// Añadir carpeta de las vistas
app.set('views', path.join(__dirname, './views'));

// Agregar flash messages
app.use(flash());

app.use(cookieParser());

// Cargar sesiones, Nos permite navegar entre páginas sin volver a autenticar
app.use(session({
    secret: 'supersecreto',
    resave: false,
    saveUninitialized: false
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

// Pasar vardump a la aplicación
app.use((req, res, next) => {

    // console.log(req.user); // Por aquí pasan los usuarios
    res.locals.year = new Date().getFullYear(); // Sacar año actual
    res.locals.vardump = helpers.vardump; // Crear variable que se pueda consumir en cualquier otro archivo
    res.locals.mensaes = req.flash(); // Pasar mensajes flash // locals.mensajes se mandan a los archivos pug
    res.locals.usuario = {...req.user} || null; // Si se encuentra un usuario logueado se almacena la información caso contrario manda un objeto vació
    next();
});



app.use('/', routes() );


app.listen( port, () => {
    console.log(`Server corriendo en el puerto: ${ port }`);
});

// Nodemailer
//require('./handlers/email');