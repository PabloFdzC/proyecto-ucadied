const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const proyectoCtlr = require('./ProyectoControlador');
const gastoCtlr = require('./GastoControlador');
const puestoCtlr = require('./PuestoControlador');


router.get('/consultar/:id', async (req, res) => {
    try{
        var habilitado = false;
        var proyectos = []
        if(req.session.idUsuario && req.session.idUsuario != -1){
            proyectos = await proyectoCtlr.consultar(req.params);
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else if(proyectos.length === 1){
                const proyecto = proyectos[0];
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
            }
        }
        if(habilitado){
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
        var proyecto_encontrado = false;
        var proyecto;
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_organizacion){
            params.id_organizacion = req.query.id_organizacion;
        }
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(params.id_organizacion){
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, params.id_organizacion, "edita_proyecto");
                }
                if(params.id){
                    proyecto =  await proyectoCtlr.consultar(req.query);
                    proyecto_encontrado = true;
                    if(!habilitado){
                        if(proyecto.length === 1){
                            habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto[0].id_organizacion, "edita_proyecto");
                        }
                    }
                }
            }
        }
        if(habilitado){
            if(proyecto_encontrado){
                res.json(proyecto);
            }
            else{
                const proyectos = await proyectoCtlr.consultar(params);
                res.json(proyectos);
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

router.post('/crear', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            if(req.body.id_organizacion){
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_proyecto");
            }
            else{
                error_encontrado = true;
                res.status(400);
                res.send("Parametros incorrectos");
            }
        }
        if(habilitado){
            const proyecto_creado = await proyectoCtlr.crear(req.body);
            res.json(proyecto_creado);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
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
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const proyectos = await proyectoCtlr.consultar({id: req.params.id_proyecto});
                if(proyectos.length === 1){
                    const proyecto = proyectos[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
                }
                else{
                    res.status(400);
                    res.send("No se encontró el proyecto");
                    error_encontrado = true;
                }
            }
        }
        if(habilitado){
            const resultado = await proyectoCtlr.modificar(req.params.id_proyecto, req.body)
            res.json(resultado);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const proyectos = await proyectoCtlr.consultar(req.params);
                if(proyectos.length === 1){
                    const proyecto = proyectos[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("No se encontró el proyecto");
                }
            }
        }
        if(habilitado){
            const resultado = await proyectoCtlr.eliminar(req.params.id);
            res.json(resultado);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarGastos/:id', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const proyectos = await proyectoCtlr.consultar(req.params);
                if(proyectos.length === 1){
                    const proyecto = proyectos[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("No se encontró el proyecto");
                }
            }
        }
        if(habilitado){
            const gastos = await gastoCtlr.consultar(req.params);
            res.json(gastos);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;