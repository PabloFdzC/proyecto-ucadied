const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const actividadCtlr = require('./ActividadControlador');
const inmuebleCtlr = require('./InmuebleControlador');
const puestoCtlr = require('./PuestoControlador');
const { verificarCaptcha } = require('./captcha');
const {
    salioBien,
    mapearError,
    estaUsuarioLoggeado,
    CODIGO_STATUS_HTTP
} = require('./respuestas.js');

// Ruta para consultar un conjunto de actividades.
// Se pueden mandar parámentros por medio de variables
// en la dirección. Dentro de estos parámetros está el
// id de la actividad, el id de la organización, el 
// tipo de actividad, el id del inmueble, si la actividad
// está habilitada o no, y el día, mes y año.
router.get('/consultar', async (req, res) => {
    try{
        var actividades;
        
        var paramsActividad = {};
        var paramsReserva = {};
        var paramsInmueble = {};
        if(req.query.id){
            paramsActividad.id = req.query.id;
        }
        if(req.query.tipo){
            paramsActividad.tipo = req.query.tipo;
        }
        if(req.query.id_organizacion){
            paramsInmueble.id_organizacion = req.query.id_organizacion;
        }
        if(req.query.id_inmueble){
            paramsInmueble.id = req.query.id_inmueble;
        }
        if(req.query.habilitado){
            paramsReserva.habilitado = req.query.habilitado === "false" ? false : true;
        }
        if(req.query.dia){
            paramsReserva.dia = req.query.dia;
        }
        if(req.query.mes){
            paramsReserva.mes = req.query.mes;
        }
        if(req.query.anio){
            paramsReserva.anio = req.query.anio;
        }
        
        actividades = await actividadCtlr.consultar(paramsActividad, paramsReserva, paramsInmueble, req.session.idUsuario);
        salioBien(actividades);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para crear una actividad. Se debe mandar la
// información de la actividad como body.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        const resp = await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        const actividad_creada = await actividadCtlr.crear_habilitar(req.body, req.session.idUsuario, false);
        res.json(actividad_creada);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para modificar una actividad. Se manda en la dirección
// el id de la actividad y en el body la información a modificar.
// Revisa antes de modificar la actividad que el usuario
// tenga el permiso de modificar actividades dentro de la organización.
router.put('/modificar/:id_actividad', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                verificaPermisos(req.params.id_actividad, req.session.idUsuario);
            }
        }
        salioBien(await actividadCtlr.modificar(req.params.id_actividad, req.body));
    }catch(err){
        mapearError(res, err);
    }
});

router.delete('/eliminarReserva/:id_reserva', async (req, res) => {
    try{
        let habilitado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                verificaPermisosReserva(req.params.id_reserva, req.session.idUsuario);
            }
            const resp = await actividadCtlr.eliminarReserva(req.params.id_reserva);
            res.json(resp);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar las reservas inhabilitadas de una actividad. 
// Se manda en la dirección el id de la actividad. Revisa antes de 
// eliminar las reservas que el usuario tenga el permiso de modificar 
// actividades dentro de la organización.
router.delete('/eliminarReservasInhabilitadas/:id_actividad', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                verificaPermisos(req.params.id_actividad, req.session.idUsuario);
            }
            const resp = await actividadCtlr.eliminarReservasInhabilitadas(req.params.id_actividad);
            res.json(resp);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para habilitar las reservas de una actividad. 
// Se manda en el body el id de la actividad. Revisa antes de 
// habilitar las reservas que el usuario tenga el permiso de modificar 
// actividades dentro de la organización.
router.post('/habilitarReservas', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(req.body.id_inmueble){
                    const inmuebles = await inmuebleCtlr.consultar({id: req.body.id_inmueble});
                    
                    const inmueble = inmuebles[0];
                    if(req.session.tipoUsuario !== "Administrador"){
                        await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_actividad");
                    }
                    
                    const resp = await actividadCtlr.crear_habilitar(req.body, req.session.idUsuario, true);
                    res.json(resp);
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
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar una actividad. Se manda en la dirección
// el id de la actividad. Revisa antes de eliminar la actividad 
// que el usuario tenga el permiso de modificar actividades dentro 
// de la organización.
router.delete('/eliminar/:id_actividad', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                verificaPermisos(req.params.id_actividad, req.session.idUsuario);
            }
            res.json(await actividadCtlr.eliminar(req.params.id_actividad));
        }
    }catch(err){
        mapearError(res, err);
    }
});

async function verificaPermisos(id_actividad, id_usuario){
    const actividades = await actividadCtlr.consultar({id: id_actividad}, {}, {});
    if(actividades.length === 1){
        const actividad = actividades[0];
        const reservas = actividad.reserva_inmuebles;

        if(reservas.length >= 1){
            const reserva = reservas[0];
            const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});
            if(inmuebles.length === 1){
                const inmueble = inmuebles[0];
                return await puestoCtlr.consultar_permisos(id_usuario, inmueble.id_organizacion, "edita_actividad");
            }
            else{
                throw {
                    status: CODIGO_STATUS_HTTP.NO_ENCONTRADO,
                    error: "No se encontró el inmueble",
                    errorConocido: true
                };   
            }
        }
        else{
            throw {
                status: CODIGO_STATUS_HTTP.NO_ENCONTRADO,
                error: "No se encontraron las reservas",
                errorConocido: true
            };
        }
    }
    else{
        throw {
            status: CODIGO_STATUS_HTTP.NO_ENCONTRADO,
            error: "No se encontró la actividad",
            errorConocido: true
        };
    }
}

async function verificaPermisosReserva(id_reserva, id_usuario){
    const inmuebles = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: id_reserva});
    if(inmuebles.length === 1){
        const inmueble = inmuebles[0];
        return await puestoCtlr.consultar_permisos(id_usuario, inmueble.id_organizacion, "edita_actividad");
    }
    else{
        throw {
            status: CODIGO_STATUS_HTTP.NO_ENCONTRADO,
            error: "No se encontró el inmueble",
            errorConocido: true
        };   
    }
}

module.exports = router;