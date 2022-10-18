const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const proyectoCtlr = require('./ProyectoControlador');
const gastoCtlr = require('./GastoControlador');
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');


router.get('/consultar/:id_proyecto', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_proyecto");
            }
        }
        if(habilitado){
            const proyectos = await proyectoCtlr.consultar(req.params);
            res.json(proyectos);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_proyecto");
            }
        }
        if(habilitado){
            var params = {};
            if(req.query.id){
                params.id = req.query.id;
            }
            if(req.query.id_organizacion){
                params.id_organizacion = req.query.id_organizacion;
            }
            const proyectos = await proyectoCtlr.consultar(params);
            res.json(proyectos);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_proyecto");
            }
        }
        if(habilitado){
            const proyecto_creado = await proyectoCtlr.crear(req.body);
            res.json(proyecto_creado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_proyecto', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_proyecto");
            }
        }
        if(habilitado){
            const resultado = await proyectoCtlr.modificar(req.params.id_proyecto, req.body)
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_proyecto', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_proyecto");
            }
        }
        if(habilitado){
            const resultado = await proyectoCtlr.eliminar(req.params.id_proyecto);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarGastos/:id_proyecto', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_proyecto");
            }
        }
        if(habilitado){
            const gastos = await gastoCtlr.consultar(req.params);
            res.json(gastos);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;