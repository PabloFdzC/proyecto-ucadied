#!/usr/bin/env
const express = require('express');
const cors = require('cors');
const path = require('path');
const ApiRouter = require('./controlador/api');
const session = require('express-session');

const app = express();
app.use(cors());
app.use(express.json());

require("./creacion_base");

var sess = {
secret: 'keyboard cat',
cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
    app.use(express.static(path.join(__dirname, 'vista/build')));

    app.get('/*', function (req, res) {
        res.sendFile(path.join(__dirname, 'vista/build', 'index.html'));
    });
}

app.use(session(sess));

app.use('/', ApiRouter);



app.set('port', 8080);
app.listen(app.get('port'));