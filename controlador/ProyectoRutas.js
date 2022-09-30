const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const proyectoCtlr = require('./ProyectoControlador');
const gastoCtlr = require('./GastoControlador');


router.get('/consultar/:id_proyecto', async (req, res) => {
    try{
        const proyectos = await proyectoCtlr.consultar(req.params);
        res.json(proyectos);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        const proyectos = await proyectoCtlr.consultar(req.params);
        res.json(proyectos);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const proyecto_creado = await proyectoCtlr.crear(req.body);
            res.json(proyecto_creado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_proyecto', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await proyectoCtlr.modificar(req.params.id_proyecto, req.body)
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_proyecto', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await proyectoCtlr.eliminar(req.params.id_proyecto);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarGastos/:id_proyecto', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const gastos = await gastoCtlr.consultar(req.params);
            res.json(gastos);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;