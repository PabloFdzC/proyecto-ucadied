const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const organizacionCtrl = require('./OrganizacionControlador');


router.get('/consultar/:id_organizacion', async (req, res) => {
    try{
        const organizaciones = await organizacionCtrl.consultar(req.params);
        res.json(organizaciones);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        const organizaciones = await organizacionCtrl.consultar(req.params);
        res.json(organizaciones);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarTipo/:esUnion', async (req, res) => {
    try{
        const organizaciones = await organizacionCtrl.consultarTipo(req.params.esUnion);
        res.json(organizaciones);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            const organizacion_creada = await organizacionCtrl.crear(req.body);
            res.json(organizacion_creada);
        }
        else{
            res.status(400);
            res.send("Usuario no administrador"+ req.session.tipoUsuario);
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_organizacion', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await organizacionCtrl.modificar(req.params.id_organizacion, req.body)
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

router.delete('/eliminar/:id_organizacion', async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            const resultado = await organizacionCtrl.eliminar(req.params.id_organizacion);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Usuario no administrador");
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
            const miembro_agregado = await organizacionCtrl.agregarMiembro(req.body);
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
            const resultado = await organizacionCtrl.eliminarMiembro(req.body.id_usuario);
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

router.get('/consultarMiembros/:id_organizacion', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const miembros = await organizacionCtrl.consultarMiembros(req.params.id_organizacion);
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