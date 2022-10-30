const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');


router.get('/consultarPuestos/:id_organizacion', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const puestos = await JuntaDirectivaCtlr.consultar_puestos(req.params.id_organizacion);
            res.json(puestos);
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

router.get('/consultarPuesto/:id_puesto', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const puesto = await JuntaDirectivaCtlr.consultar_puesto(req.params.id_puesto);
            res.json(puesto);
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

router.post('/crearPuesto', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const puesto_creado = await JuntaDirectivaCtlr.crear_puesto(req.body);
            res.json(puesto_creado);
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

router.delete('/eliminarPuesto/:id_puesto', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const resultado = await JuntaDirectivaCtlr.eliminar_puesto(req.params.id_puesto);
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

router.put('/modificarPuesto/:id_puesto', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const resultado = await JuntaDirectivaCtlr.modificar_puesto(req.params.id_puesto, req.body)
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

router.post('/agregarMiembro', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const miembro_agregado = await JuntaDirectivaCtlr.agregar_miembro(req.body);
            res.json(miembro_agregado);
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

router.post('/eliminarMiembro', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        console.log("---------------------------------------------------");
        console.log(req.body);
        console.log("---------------------------------------------------");
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            var params = {};
            if(req.body.id_puesto_jd){
                params.id_puesto_jd = req.body.id_puesto_jd;
            }
            if(req.body.id_usuario){
                params.id_usuario = req.body.id_usuario;
            }
            console.log("---------------------------------------------------");
            console.log(params);
            console.log("---------------------------------------------------");
            if(Object.keys(params).length === 2){
                const resultado = await JuntaDirectivaCtlr.eliminar_miembro(params);
                res.json(resultado);
            } else {
                res.status(400);
                res.send("Parametros incorrectos");    
            }
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

router.get('/consultarMiembros/:id_organizacion', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_junta");
            }
        }
        if(habilitado){
            const miembros = await JuntaDirectivaCtlr.consultar_miembros(req.params.id_organizacion);
            res.json(miembros);
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