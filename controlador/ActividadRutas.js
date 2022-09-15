const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const actividadCtlr = require('./ActividadControlador');


router.get('/consultar/:id_actividad', async (req, res) => {
    try{
        const actividades = await actividadCtlr.consultar(req.params);
        res.json(actividades);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        const actividades = await actividadCtlr.consultar(req.params);
        res.json(actividades);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser, async (req, res) => {
    try{
        const actividad_creada = await actividadCtlr.crear(req.body);
        res.json(actividad_creada);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_actividad', jsonParser, async (req, res) => {
    try{
        const resultado = await actividadCtlr.modificar(req.params.id_actividad, req.body)
        res.json(resultado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_actividad', async (req, res) => {
    try{
        const resultado = await actividadCtlr.eliminar(req.params.id_actividad);
        res.json(resultado);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;