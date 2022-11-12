const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const proyectoCtlr = require('./ProyectoControlador');
const gastoCtlr = require('./GastoControlador');
const puestoCtlr = require('./PuestoControlador');

// Ruta para consultar un proyecto en específico.
// Se manda el id del proyecto en la dirección.
// Revisa antes de consultar el proyecto que el usuario
// tenga el permiso de modificar proyectos dentro
// de la organización.
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

// Ruta para consultar un conjunto de proyectos.
// Se pueden mandar parámetros por medio de variables
// en la dirección. Dentro de estos parámetros está el
// id del proyecto y el id de la organización.
// Revisa antes de consultar los proyectos que el usuario
// tenga el permiso de modificar proyectos dentro
// de la organización.
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

// Ruta para crear un proyecto. Se debe mandar la
// información del proyecto como body. Revisa antes 
// de crear el proyecto que el usuario tenga el 
// permiso de modificar proyectos dentro de la organización.
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

// Ruta para modificar un proyecto. Se manda en la dirección
// el id del proyecto y en el body la información a modificar.
// Revisa antes de modificar el proyecto que el usuario
// tenga el permiso de modificar proyectos dentro de la organización.
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

// Ruta para eliminar un proyecto. Se manda en la dirección
// el id del proyecto. Revisa antes de eliminar el proyecto 
// que el usuario tenga el permiso de modificar proyectos dentro 
// de la organización.
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

// Ruta para consultar los gastos de un proyecto. Se manda 
// en la dirección el id del proyecto. Revisa antes de consultar
// los gastos del proyecto  que el usuario tenga el permiso de 
// modificar proyectos dentro de la organización.
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