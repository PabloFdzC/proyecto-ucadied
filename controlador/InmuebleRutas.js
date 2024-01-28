const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const inmuebleCtlr = require('./InmuebleControlador');
const puestoCtlr = require('./PuestoControlador');
const { mapearError,estaUsuarioLoggeado,CODIGO_STATUS_HTTP } = require('./respuestas');

// Ruta para consultar un conjunto de inmuebles.
// Se pueden mandar parámetros por medio de variables
// en la dirección. Dentro de estos parámetros está el
// id del inmueble y el id de la organización.
// Revisa antes de consultar los inmuebles
router.get('/consultar', async (req, res) => {
    try{
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_organizacion){
            params.id_organizacion = req.query.id_organizacion;
        }
        const inmuebles = await inmuebleCtlr.consultar(params);
        res.json(inmuebles);
    }catch(err){
        mapearError(res, req)
    }
});

// Ruta para crear un inmueble. Se debe mandar la
// información del inmueble como body. Revisa antes 
// de crear el inmueble que el usuario tenga el 
// permiso de modificar inmuebles dentro de la organización.
router.post('/crear', jsonParser , async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_inmueble");
            }

            const inmueble_creado = await inmuebleCtlr.crear(req.body);
            res.json(inmueble_creado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para modificar un inmueble. Se manda en la dirección
// el id del inmueble y en el body la información a modificar.
// Revisa antes de modificar el inmueble que el usuario
// tenga el permiso de modificar inmuebles dentro de la organización.
router.put('/modificar/:id_inmueble', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});
                const inmueble = inmuebles[0];
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }
            const resultado = await inmuebleCtlr.modificar(req.params.id_inmueble, req.body)
            res.json(resultado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar un inmueble. Se manda en la dirección
// el id del inmueble. Revisa antes de eliminar el inmueble 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.delete('/eliminar/:id_inmueble', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});
                const inmueble = inmuebles[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }
            const resultado = await inmuebleCtlr.eliminar(req.params.id_inmueble);
            res.json(resultado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar una reserva de un inmueble. Se manda en la dirección
// el id de la reserva del inmueble. Revisa antes de eliminar la reserva 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.delete('/eliminarReserva/:id_reserva', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
                
                const reserva = reservas[0];
                const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});

                const inmueble = inmuebles[0];
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }

            const resultado = await inmuebleCtlr.eliminar_reserva(req.params.id_reserva);
            res.json(resultado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para habilitar una reserva de un inmueble. Se manda en la dirección
// el id de la reserva del inmueble. Revisa antes de habilitar la reserva 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.post('/habilitarReserva/:id_reserva', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
                
                const reserva = reservas[0];
                const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});

                const inmueble = inmuebles[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }

            const resultado = await inmuebleCtlr.habilitar_reserva(req.params.id_reserva);
            res.json(resultado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para consultar las reservas de un inmueble. Se manda en la dirección
// el id de del inmueble. Revisa antes de consultar las reservas 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.get('/consultarReservas/:id_inmueble', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});
                
                const inmueble = inmuebles[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }

            const reservas = await inmuebleCtlr.consultar_reservas(req.params);
            res.json(reservas);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para consultar todas las reservas de los inmuebles. 
// Revisa antes de consultar las reservas que el usuario
// sea administrador.
router.get('/consultarReservas/', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});

                const inmueble = inmuebles[0];
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }

            const reservas = await inmuebleCtlr.consultar_reservas(req.params);
            res.json(reservas);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para consultar una reserva de un inmueble. Se manda en la dirección
// el id de la reserva del inmueble. Revisa antes de consultar la reserva 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.get('/consultarReserva/:id_reserva', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
                
                const reserva = reservas[0];
                const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});

                const inmueble = inmuebles[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
            }

            const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
            res.json(reservas);
        }
    }catch(err){
        mapearError(err, res);
    }
});

module.exports = router;