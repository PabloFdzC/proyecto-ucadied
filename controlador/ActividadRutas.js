const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const actividadCtlr = require('./ActividadControlador');
const inmuebleCtlr = require('./InmuebleControlador');
const puestoCtlr = require('./PuestoControlador');
const { verificarCaptcha } = require('./captcha');

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

        res.json(actividades);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para crear una actividad. Se debe mandar la
// información de la actividad como body.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        //const resp = {exito:true};
        const resp = await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        if(resp.exito){
            const actividad_creada = await actividadCtlr.crear_habilitar(req.body, req.session.idUsuario, false);
            if(actividad_creada.error || actividad_creada.errores){
                res.status(400);
            }
            res.json(actividad_creada);
        } else { 
            console.log(resp);
            res.status(400);
            res.send(resp);    
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para modificar una actividad. Se manda en la dirección
// el id de la actividad y en el body la información a modificar.
// Revisa antes de modificar la actividad que el usuario
// tenga el permiso de modificar actividades dentro de la organización.
router.put('/modificar/:id_actividad', jsonParser, async (req, res) => {
    try{
        let habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador")
                habilitado = true;
            else
                habilitado = verificaPermisos(req.params.id_actividad, req.session.idUsuario);
        }
        if(habilitado){
            const resultado = await actividadCtlr.modificar(req.params.id_actividad, req.body);
            if(resultado.error || resultado.errores){
                res.status(400);
            }
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        devuelveError(err, res);
    }
});

router.delete('/eliminarReserva/:id_reserva', async (req, res) => {
    try{
        let habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = verificaPermisosReserva(req.params.id_reserva, req.session.idUsuario);
            }
        }
        if(habilitado){
            const resp = await actividadCtlr.eliminarReserva(req.params.id_reserva);
            res.json(resp);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        devuelveError(err, res);
    }
});

// Ruta para eliminar las reservas inhabilitadas de una actividad. 
// Se manda en la dirección el id de la actividad. Revisa antes de 
// eliminar las reservas que el usuario tenga el permiso de modificar 
// actividades dentro de la organización.
router.delete('/eliminarReservasInhabilitadas/:id_actividad', async (req, res) => {
    try{
        let habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = verificaPermisos(req.params.id_actividad, req.session.idUsuario);
            }
        }
        if(habilitado){
            const resp = await actividadCtlr.eliminarReservasInhabilitadas(req.params.id_actividad);
            res.json(resp);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        devuelveError(err, res);
    }
});

// Ruta para habilitar las reservas de una actividad. 
// Se manda en el body el id de la actividad. Revisa antes de 
// habilitar las reservas que el usuario tenga el permiso de modificar 
// actividades dentro de la organización.
router.post('/habilitarReservas', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(req.body.id_inmueble){
                    const inmuebles = await inmuebleCtlr.consultar({id: req.body.id_inmueble});
                    if(inmuebles.length === 1){
                        const inmueble = inmuebles[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_actividad");
                    }
                    else{
                        error_encontrado = true;
                        res.status(400);
                        res.send("No se encontró el inmueble");    
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
            const resp = await actividadCtlr.crear_habilitar(req.body, req.session.idUsuario, true);
            if(resp.error || resp.errores){
                console.log(resp);
                res.status(400);
            }
            res.json(resp);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
        }
    }catch(err){
        console.log(err);
        devuelveError(err, res);
    }
});

// Ruta para eliminar una actividad. Se manda en la dirección
// el id de la actividad. Revisa antes de eliminar la actividad 
// que el usuario tenga el permiso de modificar actividades dentro 
// de la organización.
router.delete('/eliminar/:id_actividad', async (req, res) => {
    try{
        let habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = verificaPermisos(req.params.id_actividad, req.session.idUsuario);
            }
        }
        if(habilitado){
            const resultado = await actividadCtlr.eliminar(req.params.id_actividad);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        devuelveError(err, res);
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
                    status: 400,
                    error: "No se encontró el inmueble",
                };   
            }
        }
        else{
            throw {
                status: 400,
                error: "No se encontraron las reservas",
            };
        }
    }
    else{
        throw {
            status: 400,
            error: "No se encontró la actividad",
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
            status: 400,
            error: "No se encontró el inmueble",
        };   
    }
}

function devuelveError(err, res){
    if(typeof err === "object" && err.error && err.status){
        res.status(err.status);
        res.send(err.error);
    }else{
        res.send("Algo salió mal");
        res.status(400);
    }
}

module.exports = router;