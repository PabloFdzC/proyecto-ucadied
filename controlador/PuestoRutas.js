const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const puestoCtlr = require('./PuestoControlador');

router.put('/modificar/:id', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const puestos = await puestoCtlr.consultar(req.params.id);
                if(puestos.length === 1){
                    const puesto = puestos[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, puesto.id_organizacion, "edita_junta");
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("Puesto no encontrado");
                }
            }
        }
        if(habilitado){
            const resultado = await puestoCtlr.modificar(req.params.id, req.body)
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

router.post('/crear', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(req.body.id_organizacion){
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_junta");
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("Parametros incorrectos");
                }
            }
        }
        if(habilitado){
            const miembro_agregado = await puestoCtlr.crear(req.body);
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

router.delete('/eliminar/:id', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        const puestos = await puestoCtlr.consultar({id:req.params.id});
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
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, puesto.id_organizacion, "edita_junta");
            }
        }
        if(habilitado){
            const resultado = await puestoCtlr.eliminar(req.params);
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

router.get('/consultar', async (req, res) => {
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
        if(req.query.id_usuario){
            params.id_usuario = req.query.id_usuario;
        }
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, params.id_organizacion, "edita_junta");
            }
        }
        if(habilitado){
            if(miembro_encontrado){
                res.json(miembro);
            }
            else{
                const miembros = await puestoCtlr.consultar(params);
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

module.exports = router;