const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const inmuebleCtlr = require('./InmuebleControlador');



router.get('/consultar/:id_inmueble', async (req, res) => {
    try{
        const inmuebles = await inmuebleCtlr.consultar(req.params);
        res.json(inmuebles);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

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

router.post('/crear', jsonParser , async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            console.log(req.body);
            const inmueble_creado = await inmuebleCtlr.crear(req.body);
            res.json(inmueble_creado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_inmueble', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await inmuebleCtlr.modificar(req.params.id_inmueble, req.body)
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_inmueble', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await inmuebleCtlr.eliminar(req.params.id_inmueble);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminarReserva/:id_reserva', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await inmuebleCtlr.eliminar_reserva(req.params.id_reserva);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/habilitarReserva/:id_reserva', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await inmuebleCtlr.habilitar_reserva(req.params.id_reserva);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarReservas/:id_inmueble', async (req, res) => {
    try{
        const reservas = await inmuebleCtlr.consultar_reservas(req.params);
        res.json(reservas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarReservas/', async (req, res) => {
    try{
        var reservas;
        if(req.query.mes && req.query.anio){
            reservas = await inmuebleCtlr.consultar_reservas_mes_anio(req.query.mes, req.query.anio);
        }
        else{
            reservas = await inmuebleCtlr.consultar_reservas(req.params);
        }
        res.json(reservas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarReserva/:id_reserva_inmueble', async (req, res) => {
    try{
        const reservas = await inmuebleCtlr.consultar_reservas(req.params);
        res.json(reservas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;