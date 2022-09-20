const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');


router.get('/consultar/:id_organizacion', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const juntas = await JuntaDirectivaCtlr.consultar(req.params);
            res.json(juntas);
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

router.get('/consultar', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const juntas = await JuntaDirectivaCtlr.consultar(req.params);
            res.json(juntas);
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

router.get('/consultarPuestos/:id_junta_directiva', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const puestos = await JuntaDirectivaCtlr.consultar_puestos(req.params.id_junta_directiva);
            res.json(puestos);
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

router.get('/consultarPuesto/:id_puesto', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const puesto = await JuntaDirectivaCtlr.consultar_puesto(req.params.id_puesto);
            res.json(puesto);
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

router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const junta_directiva_creada = await JuntaDirectivaCtlr.crear(req.body);
            res.json(junta_directiva_creada);
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

router.post('/crearPuesto', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const puesto_creado = await JuntaDirectivaCtlr.crear_puesto(req.body);
            res.json(puesto_creado);
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

router.delete('/eliminarPuesto/:id_puesto', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await JuntaDirectivaCtlr.eliminar_puesto(req.params.id_puesto);
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

router.put('/modificarPuesto/:id_puesto', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await JuntaDirectivaCtlr.modificar_puesto(req.params.id_puesto, req.body)
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

router.put('/modificar/:id_junta_directiva', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await JuntaDirectivaCtlr.modificar(req.params.id_junta_directiva, req.body)
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

router.delete('/eliminar/:id_junta_directiva', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await JuntaDirectivaCtlr.eliminar(req.params.id_junta_directiva);
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

router.post('/agregarMiembro', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const miembro_agregado = await JuntaDirectivaCtlr.agregar_miembro(req.body);
            res.json(miembro_agregado);
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

router.delete('/eliminarMiembro', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await JuntaDirectivaCtlr.eliminar_miembro(req.body.id_puesto);
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

router.get('/consultarMiembros/:id_junta_directiva', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const miembros = await JuntaDirectivaCtlr.consultar_miembros(req.params.id_junta_directiva);
            res.json(miembros);
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

module.exports = router;