const express = require('express');


const app = express();

require("./creacion_base")

app.set('port', 8080);


app.listen(app.get('port'));