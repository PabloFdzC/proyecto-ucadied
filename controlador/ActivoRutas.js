const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const activoCtlr = require('./ActivoControlador');



router.get('/consultar/:id_activo', async (req, res) => {
    try{
        const activos = await activoCtlr.consultar(req.params);
        res.json(activos);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        const activos = await activoCtlr.consultar(req.params);
        res.json(activos);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser , async (req, res) => {
    try{
        console.log(req.body);
        const activo_creado = await activoCtlr.crear(req.body);
        res.json(activo_creado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_activo', jsonParser, async (req, res) => {
    try{
        const resultado = await activoCtlr.modificar(req.params.id_activo, req.body)
        res.json(resultado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_activo', async (req, res) => {
    try{
        const resultado = await activoCtlr.eliminar(req.params.id_activo);
        res.json(resultado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;