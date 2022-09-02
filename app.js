const express = require('express');
const ApiRouter = require('./controlador/api');

const app = express();

require("./creacion_base");

app.use('/api', ApiRouter);

app.set('port', 8080);


app.listen(app.get('port'));