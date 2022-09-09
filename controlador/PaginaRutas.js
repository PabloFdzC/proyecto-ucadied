const router = require('express').Router();
const bodyParser = require('body-parser');
const urlencodedParser  = bodyParser.urlencoded({ extended: false });
const paginaCtlr = require('./PaginaControlador');

router.get('/consultar/:id_pagina', async (req, res) => {
    try{
        const paginas = await paginaCtlr.consultar(req.params);
        res.json(paginas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        const paginas = await paginaCtlr.consultar(req.params);
        res.json(paginas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', urlencodedParser, async (req, res) => {
    try{
        const pagina_creada = await paginaCtlr.crear(req.body);
        res.json(pagina_creada);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_pagina', urlencodedParser, async (req, res) => {
    try{
        const resultado = await paginaCtlr.modificar(req.params.id_pagina, req.body);
        res.json(resultado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_pagina', async (req, res) => {
    try{
        const resultado = await paginaCtlr.eliminar(req.params.id_pagina);
        res.json(resultado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;