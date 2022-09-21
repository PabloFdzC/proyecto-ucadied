const https = require('https');
const fs = require('fs');

const express = require('express');
const cors = require('cors');
const path = require('path');
const ApiRouter = require('./controlador/api');
const session = require('express-session');

const app = express();
app.use(cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
}));

require("./creacion_base");

var sess = {
    secret: 'm!S3ssi0nn0de',
    resave: false,
    saveUninitialized: true,
    cookie: {  }
  }

app.use('/', ApiRouter);

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
     app.use(express.static(path.join(__dirname, 'vista/build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'vista/build', 'index.html'));
    });
}

app.use(session(sess));




app.set('port', 8080);
//app.listen(app.get('port'));

https.createServer({
    key: fs.readFileSync(path.join(__dirname, 'SSH/key.pem'), 'utf-8'),
    cert: fs.readFileSync(path.join(__dirname, 'SSH/cert.pem'), 'utf-8'),
  },app)
  .listen(app.get('port'));