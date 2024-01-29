const express = require('express');
const cors = require('cors');
const path = require('path');
const ApiRouter = require('./controlador/api');
const session = require('express-session');
const MemoryStore = require('memorystore')(session);
const fs = require("fs");

const app = express();
app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
}));

require("./creacion_base");

// Aquí primero se crea la carpeta de archivos/Imagen
const ubicacionArchivos = path.join(__dirname, 'archivos/Imagen');
fs.mkdirSync(ubicacionArchivos, { recursive: true });
// Luego se hace pública
app.use('/archivos/Imagen', express.static(ubicacionArchivos));


var sess = {
    secret: 'm!S3ssi0nn0de',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 86400000 },
    store: new MemoryStore({
      checkPeriod: 86400000
    }),
  }


app.use(session(sess));
app.use('/api', ApiRouter);

if (app.get('env') === 'production') {
    //app.set('trust proxy', 1);
    //sess.cookie.secure = true;
    app.use(express.static(path.join(__dirname, 'vista/build')));
    

    app.get('*', function (req, res) {
        res.sendFile(path.join(__dirname, 'vista/build', 'index.html'));
    });
}


app.set('port', 8080);
app.listen(app.get('port'));

// https.createServer({
//     key: fs.readFileSync(path.join(__dirname, 'SSH/key.pem'), 'utf-8'),
//     cert: fs.readFileSync(path.join(__dirname, 'SSH/cert.pem'), 'utf-8'),
//   },app)
//   .listen(app.get('port'));