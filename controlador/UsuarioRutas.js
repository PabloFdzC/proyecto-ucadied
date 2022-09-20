const router = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const usuarioCtrl = require('./UsuarioControlador');

router.get('/consultar/:id_usuario', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const usuario = await usuarioCtrl.consultar(req.params);
            res.json(usuario);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const usuarios = await usuarioCtrl.consultar(req.params);
            res.json(usuarios);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultarTipo/:esAdmin', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const usuarios = await usuarioCtrl.consultarTipo(req.params.esAdmin);
            res.json(usuarios);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            req.body.tipo = "Usuario";
            const usuario_creado = await usuarioCtrl.crear(req.body);
            res.json(usuario_creado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        if (error.name === 'SequelizeUniqueConstraintError') {
            res.status(400)
            res.send("Ya existe un usuario con ese correo");
        }
        else{
            res.status(400);
            res.send("Algo salió mal");
        }
    }
});

router.post('/iniciarSesion', jsonParser, async (req, res) => {
    try{
        const resultado = await usuarioCtrl.iniciarSesion(req.body);
        if(resultado.success){
            req.session.idUsuario = resultado.id_usuario;
            req.session.tipoUsuario = resultado.tipo;
        }
        res.json(resultado);
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/cerrarSesion', async (req, res) => {
    try{
        req.session.idUsuario = -1;
        req.session.tipoUsuario = "";
        res.json({success: "Sesión cerrada"});
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_usuario', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await usuarioCtrl.modificar(req.params.id_usuario, req.body)
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificarContrasenna/:id_usuario', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await usuarioCtrl.modificar(req.params.id_usuario, req.body)
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_usuario', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await usuarioCtrl.eliminar(req.params.id_usuario);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;