const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const activoCtlr = require('./ActivoControlador');



router.get('/consultar/:id_activo', async (req, res) => {
    try{
        const activos = await activoCtlr.consultar(req.params);
        res.json(activos);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        const activos = await activoCtlr.consultar(req.params);
        res.json(activos);
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
            const activo_creado = await activoCtlr.crear(req.body);
            res.json(activo_creado);
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

router.put('/modificar/:id_activo', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await activoCtlr.modificar(req.params.id_activo, req.body)
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

router.delete('/eliminar/:id_activo', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await activoCtlr.eliminar(req.params.id_activo);
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
            const resultado = await activoCtlr.eliminar_reserva(req.params.id_reserva);
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
            const resultado = await activoCtlr.habilitar_reserva(req.params.id_reserva);
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

router.get('/consultarReservas/:id_activo', async (req, res) => {
    try{
        const reservas = await activoCtlr.consultar_reservas(req.params);
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
            reservas = await activoCtlr.consultar_reservas_mes_anio(req.query.mes, req.query.anio);
        }
        else{
            reservas = await activoCtlr.consultar_reservas(req.params);
        }
        res.json(reservas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarReserva/:id_reserva_activo', async (req, res) => {
    try{
        const reservas = await activoCtlr.consultar_reservas(req.params);
        res.json(reservas);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;