const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const gastoCtlr = require('./GastoControlador');
const puestoCtlr = require('./PuestoControlador');
const proyectoCtlr = require('./ProyectoControlador');
const {estaUsuarioLoggeado,CODIGO_STATUS_HTTP} = require('respuestas');

// Ruta para consultar un conjunto de gastos.
// Se pueden mandar parámetros por medio de variables
// en la dirección. Dentro de estos parámetros está el
// id del gasto y el id del proyecto.
// Revisa antes de consultar los gastos que el usuario
// tenga el permiso de modificar proyectos dentro
// de la organización.
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
        if(estaUsuarioLoggeado(req)){
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
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para crear un gasto. Se debe mandar la
// información del gasto como body. Revisa antes 
// de crear el gasto que el usuario tenga el 
// permiso de modificar proyectos dentro de la organización.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(req.body.id_proyecto){
                    const proyectos = await proyectoCtlr.consultar({id: req.body.id_proyecto});
                    const proyecto = proyectos[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
                }
                else{
                    throw {
                        errorConocido: true,
                        status: CODIGO_STATUS_HTTP.ERROR_USUARIO,
                        error: "Parametros incorrectos"
                    }
                }
            }
        }
        if(habilitado){
            const gasto_creado = await gastoCtlr.crear(req.body);
            res.json(gasto_creado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para modificar un gasto. Se manda en la dirección
// el id del gasto y en el body la información a modificar.
// Revisa antes de modificar el gasto que el usuario
// tenga el permiso de modificar proyectos dentro de la organización.
router.put('/modificar/:id_gasto', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const gastos = await gastoCtlr.consultar({id: req.params.id_gasto});
                const gasto = gastos[0];
                const proyectos = await proyectoCtlr.consultar({id: gasto.id_proyecto});
                const proyecto = proyectos[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
            }
            const resultado = await gastoCtlr.modificar(req.params.id_gasto, req.body)
            res.json(resultado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar un gasto. Se manda en la dirección
// el id del gasto. Revisa antes de eliminar el gasto 
// que el usuario tenga el permiso de modificar proyectos dentro 
// de la organización.
router.delete('/eliminar/:id_gasto', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const gastos = await gastoCtlr.consultar({id: req.params.id_gasto});
                const gasto = gastos[0];
                const proyectos = await proyectoCtlr.consultar({id: gasto.id_proyecto});
                const proyecto = proyectos[0];
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, proyecto.id_organizacion, "edita_proyecto");
                const resultado = await gastoCtlr.eliminar(req.params.id_gasto);
                res.json(resultado);
            }
        }
    }catch(err){
        mapearError(res, err);
    }
});

module.exports = router;