const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const gastoCtlr = require('./GastoControlador');
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');

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
            if(req.query.id_proyecto){
                params.id_proyecto = req.query.id_proyecto;
            }
            const gastos = await gastoCtlr.consultar(params);
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
            const gasto_creado = await gastoCtlr.crear(req.body);
            res.json(gasto_creado);
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

router.put('/modificar/:id_gasto', jsonParser, async (req, res) => {
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
            const resultado = await gastoCtlr.modificar(req.params.id_gasto, req.body)
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

router.delete('/eliminar/:id_gasto', async (req, res) => {
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
            const resultado = await gastoCtlr.eliminar(req.params.id_gasto);
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

module.exports = router;