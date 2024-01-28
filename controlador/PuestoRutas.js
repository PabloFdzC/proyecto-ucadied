const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const puestoCtlr = require('./PuestoControlador');
const {estaUsuarioLoggeado,CODIGO_STATUS_HTTP} = require('respuestas');
const { mapearError } = require('./respuestas');

// Ruta para modificar un puesto, se debe mandar
// el id del puesto en la dirección del puesto y 
// en el body la información a modificar. Revisa
// antes de modificar el puesto que el usuario
// tenga el permiso de modificar la junta
// directiva de la organización.
router.put('/modificar/:id', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const puestos = await puestoCtlr.consultar({id:req.params.id});
                const puesto = puestos[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, puesto.id_organizacion, "edita_junta");
            }

            const resultado = await puestoCtlr.modificar(req.params.id, req.body)
            res.json(resultado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para crear un puesto, se debe mandar
// en el body la información del puesto. Revisa
// antes de crear el puesto que el usuario
// tenga el permiso de modificar la junta
// directiva de la organización.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_junta");
            }

            const miembro_agregado = await puestoCtlr.crear(req.body);
            res.json(miembro_agregado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar un puesto, se debe mandar
// el id del puesto en la dirección del puesto. 
// Revisa antes de modificar el puesto que el usuario
// tenga el permiso de modificar la junta
// directiva de la organización.
router.delete('/eliminar/:id', jsonParser, async (req, res) => {
    try{
        const puestos = await puestoCtlr.consultar({id:req.params.id});
        var puesto = puestos[0];

        if(req.session.tipoUsuario !== "Administrador"){
            await puestoCtlr.consultar_permisos(req.session.idUsuario, puesto.id_organizacion, "edita_junta");
        }

        const resultado = await puestoCtlr.eliminar(req.params);
        res.json(resultado);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para consultar un conjunto de puestos.
// Se pueden enviar parámetros a través de variables
// en la dirección. Entre estos parámetros están el id,
// el id de la organización y el id del usuario.
// Revisa antes de consultar los puestos que el usuario
// tenga el permiso de modificar la junta
// directiva de la organización.
router.get('/consultar', async (req, res) => {
    try{
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
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador" && req.session.idUsuario !== req.query.id_usuario){
                if(!params.id_organizacion){
                    throw {
                        errorConocido: true,
                        status: CODIGO_STATUS_HTTP.ERROR_USUARIO,
                        error: "Parametros incorrectos"
                    }
                }
                await puestoCtlr.consultar_permisos(req.session.idUsuario, params.id_organizacion, "edita_junta");
            }

            const miembros = await puestoCtlr.consultar(params);
            res.json(miembros);
        }
    }catch(err){
        mapearError(res, err);
    }
});

module.exports = router;