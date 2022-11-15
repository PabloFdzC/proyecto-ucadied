const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const inmuebleCtlr = require('./InmuebleControlador');
const puestoCtlr = require('./PuestoControlador');

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
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para crear un inmueble. Se debe mandar la
// información del inmueble como body. Revisa antes 
// de crear el inmueble que el usuario tenga el 
// permiso de modificar inmuebles dentro de la organización.
router.post('/crear', jsonParser , async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            if(req.body.id_organizacion){
                habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_inmueble");
            }
            else{
                error_encontrado = true;
                res.status(400);
                res.send("Parametros incorrectos");
            }
        }
        if(habilitado){
            const inmueble_creado = await inmuebleCtlr.crear(req.body);
            res.json(inmueble_creado);
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

// Ruta para modificar un inmueble. Se manda en la dirección
// el id del inmueble y en el body la información a modificar.
// Revisa antes de modificar el inmueble que el usuario
// tenga el permiso de modificar inmuebles dentro de la organización.
router.put('/modificar/:id_inmueble', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});
                if(inmuebles.length === 1){
                    const inmueble = inmuebles[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
                }
                else{
                    res.status(400);
                    res.send("No se encontró el inmueble");
                    error_encontrado = true;
                }
            }
        }
        if(habilitado){
            const resultado = await inmuebleCtlr.modificar(req.params.id_inmueble, req.body)
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

// Ruta para eliminar un inmueble. Se manda en la dirección
// el id del inmueble. Revisa antes de eliminar el inmueble 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.delete('/eliminar/:id_inmueble', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});
                if(inmuebles.length === 1){
                    const inmueble = inmuebles[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
                }
                else{
                    res.status(400);
                    res.send("No se encontró el inmueble");
                    error_encontrado = true;
                }
            }
        }
        if(habilitado){
            const resultado = await inmuebleCtlr.eliminar(req.params.id_inmueble);
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

// Ruta para eliminar una reserva de un inmueble. Se manda en la dirección
// el id de la reserva del inmueble. Revisa antes de eliminar la reserva 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.delete('/eliminarReserva/:id_reserva', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
                if(reservas.length === 1){
                    const reserva = reservas[0];
                    const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});
                    if(inmuebles.length === 1){
                        const inmueble = inmuebles[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
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
                    res.send("No se encontró la reserva");    
                }
            }
        }
        if(habilitado){
            const resultado = await inmuebleCtlr.eliminar_reserva(req.params.id_reserva);
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

// Ruta para habilitar una reserva de un inmueble. Se manda en la dirección
// el id de la reserva del inmueble. Revisa antes de habilitar la reserva 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.post('/habilitarReserva/:id_reserva', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
                if(reservas.length === 1){
                    const reserva = reservas[0];
                    const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});
                    if(inmuebles.length === 1){
                        const inmueble = inmuebles[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
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
                    res.send("No se encontró la reserva");    
                }
            }
        }
        if(habilitado){
            const resultado = await inmuebleCtlr.habilitar_reserva(req.params.id_reserva);
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

// Ruta para consultar las reservas de un inmueble. Se manda en la dirección
// el id de del inmueble. Revisa antes de consultar las reservas 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.get('/consultarReservas/:id_inmueble', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const inmuebles = await inmuebleCtlr.consultar({id: req.params.id_inmueble});
                if(inmuebles.length === 1){
                    const inmueble = inmuebles[0];
                    habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
                }
                else{
                    res.status(400);
                    res.send("No se encontró el inmueble");
                    error_encontrado = true;
                }
            }
        }
        if(habilitado){
            const reservas = await inmuebleCtlr.consultar_reservas(req.params);
            res.json(reservas);
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

// Ruta para consultar todas las reservas de los inmuebles. 
// Revisa antes de consultar las reservas que el usuario
// sea administrador.
router.get('/consultarReservas/', async (req, res) => {
    try{
        if(habilitado){
            var reservas;
            if(req.query.mes && req.query.anio){
                reservas = await inmuebleCtlr.consultar_reservas_mes_anio(req.query.mes, req.query.anio);
            }
            else{
                reservas = await inmuebleCtlr.consultar_reservas(req.params);
            }
            res.json(reservas);
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

// Ruta para consultar una reserva de un inmueble. Se manda en la dirección
// el id de la reserva del inmueble. Revisa antes de consultar la reserva 
// que el usuario tenga el permiso de modificar inmuebles dentro 
// de la organización.
router.get('/consultarReserva/:id_reserva', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
                if(reservas.length === 1){
                    const reserva = reservas[0];
                    const inmuebles = await inmuebleCtlr.consultar({id: reserva.id_inmueble});
                    if(inmuebles.length === 1){
                        const inmueble = inmuebles[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_inmueble");
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
                    res.send("No se encontró la reserva");    
                }
            }
        }
        if(habilitado){
            const reservas = await inmuebleCtlr.consultar_reservas({id_reserva_inmueble: req.params.id_reserva});
            res.json(reservas);
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