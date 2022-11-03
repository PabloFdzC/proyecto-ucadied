const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const actividadCtlr = require('./ActividadControlador');
const inmuebleCtlr = require('./InmuebleControlador');
const puestoCtlr = require('./PuestoControlador');
const { verificarCaptcha } = require('./captcha');
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

router.post('/crear', jsonParser, async (req, res) => {
    try{
        const resp = {exito:true};
        //const resp = await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        if(resp.exito){
            const actividad_creada = await actividadCtlr.crear_habilitar(req.body, req.session.idUsuario, false);
            if(actividad_creada.error || actividad_creada.errores){
                res.status(400);
            }
            res.json(actividad_creada);
        } else { 
            console.log(resp.error);
            res.status(400);
            res.send(resp.error);    
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

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

router.post('/habilitarReservas', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            if(habilitado){
                const resp = await actividadCtlr.crear_habilitar(req.body, req.session.idUsuario, true);
                if(resp.error || resp.errores){
                    console.log(resp);
                    res.status(400);
                }
                res.json(resp);
            }
        }
    }catch(err){
        console.log(err);
        devuelveError(err, res);
    }
});

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
    const actividades = await actividadCtlr.consultar({id: req.params.id_actividad}, {}, {});
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