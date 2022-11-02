const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');

router.put('/modificarMiembro/:id', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const puestos = await JuntaDirectivaCtlr.consultar_miembro(req.params.id);
                if(puestos.length === 1){
                    const puesto = puestos[0];
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, puesto.id_organizacion, "edita_junta");
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("Puesto no encontrado");
                }
            }
        }
        if(habilitado){
            const resultado = await JuntaDirectivaCtlr.modificar_miembro(req.params.id, req.body)
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

router.post('/agregarMiembro', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(req.body.id_organizacion){
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_junta");
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("Parametros incorrectos");
                }
            }
        }
        if(habilitado){
            const miembro_agregado = await JuntaDirectivaCtlr.agregar_miembro(req.body);
            res.json(miembro_agregado);
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

router.delete('/eliminarMiembro/:id', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        const puestos = await JuntaDirectivaCtlr.consultar_miembro(req.params.id);
        var puesto;
        if(puestos.length === 1){
            puesto = puestos[0];
        }
        else{
            error_encontrado = true;
            res.status(400);
            res.send("Puesto no encontrado");
        }
        if(req.session.tipoUsuario === "Administrador"){
            if(!error_encontrado){
                habilitado = true;
            }
        }
        else{
            if(!error_encontrado){
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, puesto.id_organizacion, "edita_junta");
            }
        }
        if(habilitado){
            const resultado = await JuntaDirectivaCtlr.eliminar_miembro(req.params);
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

router.get('/consultarMiembros', async (req, res) => {
    try{
        var habilitado = false;
        var miembro_encontrado = false;
        var miembro;
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
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, params.id_organizacion, "edita_junta");
                }
                if(params.id){
                    miembro =  await JuntaDirectivaCtlr.consultar_miembro(params.id);
                    miembro_encontrado = true;
                    if(!habilitado){
                        if(miembro.length === 1){
                            habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, miembro[0].id_organizacion, "edita_junta");
                        }
                    }
                }
            }
        }
        if(habilitado){
            if(miembro_encontrado){
                res.json(miembro);
            }
            else{
                const miembros = await JuntaDirectivaCtlr.consultar_miembros(params);
                res.json(miembros);
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
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, params.id_organizacion, "edita_proyecto");
                }
                if(params.id){
                    proyecto =  await proyectoCtlr.consultar(req.query);
                    proyecto_encontrado = true;
                    if(!habilitado){
                        if(proyecto.length === 1){
                            habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, proyecto[0].id_organizacion, "edita_proyecto");
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

module.exports = router;