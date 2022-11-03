const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const gastoCtlr = require('./GastoControlador');
const puestoCtlr = require('./PuestoControlador');
const proyectoCtlr = require('./ProyectoControlador');

router.get('/consultar', async (req, res) => {
    try{
        var habilitado = false;
        var gastos_encontrados = false;
        var gastos = [];
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_proyecto){
            params.id_proyecto = req.query.id_proyecto;
        }
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                var id_proyecto = null;
                if(params.id_proyecto){
                    id_proyecto = params.id_proyecto;
                }
                else if(params.id){
                    gastos = await gastoCtlr.consultar(params);
                    if(gastos.length === 1){
                        gastos_encontrados = true;
                        const gasto = gastos[0];
                        id_proyecto = gasto.id_proyecto;
                    }
                }
                if(params.id_proyecto || gastos_encontrados){
                    const proyectos = await proyectoCtlr.consultar({id: id_proyecto});
                    if(proyectos.length === 1){
                        const proyecto = proyectos[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
                    }
                }
            }
        }
        if(habilitado){
            if(gastos_encontrados){
                res.json(gastos);
            }
            else{
                gastos = await gastoCtlr.consultar(params);
                res.json(gastos);
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
            else{
                if(req.body.id_proyecto){
                    const proyectos = await proyectoCtlr.consultar({id: req.body.id_proyecto});
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
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("Parametros incorrectos");    
                }
            }
        }
        if(habilitado){
            const gasto_creado = await gastoCtlr.crear(req.body);
            res.json(gasto_creado);
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

router.put('/modificar/:id_gasto', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const gastos = await gastoCtlr.consultar({id: req.params.id_gasto});
                if(gastos.length === 1){
                    const gasto = gastos[0];
                    const proyectos = await proyectoCtlr.consultar({id: gasto.id_proyecto});
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
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("No se encontró el gasto");    
                }
            }
        }
        if(habilitado){
            const resultado = await gastoCtlr.modificar(req.params.id_gasto, req.body)
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

router.delete('/eliminar/:id_gasto', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const gastos = await gastoCtlr.consultar({id: req.params.id_gasto});
                if(gastos.length === 1){
                    const gasto = gastos[0];
                    const proyectos = await proyectoCtlr.consultar({id: gasto.id_proyecto});
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
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("No se encontró el gasto");    
                }
            }
        }
        if(habilitado){
            const resultado = await gastoCtlr.eliminar(req.params.id_gasto);
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

module.exports = router;