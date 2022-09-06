const express = require('express');
const ApiRouter = require('./controlador/api');
const session = require('express-session');

const app = express();

require("./creacion_base");

var sess = {
secret: 'keyboard cat',
cookie: {}
}

if (app.get('env') === 'production') {
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use('/', ApiRouter);
app.use(session(sess));

app.set('port', 8080);


app.listen(app.get('port'));