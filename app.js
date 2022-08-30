const express = require('express');


const app = express();

app.set('port', 8080);


app.listen(app.get('port'));