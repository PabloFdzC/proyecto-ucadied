const router = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const usuarioCtrl = require('./UsuarioControlador');
const { verificarCaptcha } = require('./captcha');

// Ruta para consultar un usuario en específico
// se manda en la dirección el id del usuario.
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

// Ruta para saber si hay una sesión activa
// en el sistema.
router.get('/sesionActiva', async (req, res) => {
    if(req.session.idUsuario && req.session.idUsuario != -1){
        res.send(true);
    }else{
        res.send(false);
    }
});

// Ruta para consultar una lista de usuarios.
// Se pueden mandar diversos parámetros por
// medio de variables en la dirección, entre
// estos parámetros están el id, el id de la
// organización y el tipo.
router.get('/consultar', async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            var params = {};
            if(req.query.id){
                params.id = req.query.id;
            }
            if(req.query.id_organizacion){
                params.id_organizacion = req.query.id_organizacion;
            }
            if(req.query.tipo){
                params.tipo = req.query.tipo;
            }
            const usuarios = await usuarioCtrl.consultar(params);
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

// Ruta para consultar un tipo de usuario.
// Se manda en la dirección un 1 si se desea
// consultar administradores y un 0 si se desea
// consultar usuarios normales.
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

// Ruta para crear un usuario, en el body debe
// venir la información del usuario.
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

// Ruta para iniciar sesión en el sistema.
// En el body debe venir el correo y la
// contraseña. La información del usuario
// se guarda en el session de express.
router.post('/iniciarSesion', jsonParser, async (req, res) => {
    try{
        const resultado = await usuarioCtrl.iniciarSesion(req.body);
        if(resultado.success){
            req.session.idUsuario = resultado.id_usuario;
            req.session.tipoUsuario = resultado.tipo;
            res.json(resultado);
        } else {
            res.status(401);
            res.send(resultado);
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para cerrar sesión, no se debe mandar
// un body. Borra la información del usuario
// del session de express.
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

// Ruta para modificar un usuario. En la dirección
// se debe mandar el id del usuario a modificar y
// en el body se manda la información del usuario
// que se debe modificar.
router.put('/modificar/:id_usuario', jsonParser, async (req, res) => {
    try{
        if(req.body.contrasenna){
            delete req.body.contrasenna;
        }
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

// Ruta para modificar la contraseña de un usuario.
// En la dirección se debe mandar el id del usuario al
// que se le modifica la contraseña y en el body debe venir
// la contraseña nueva.
router.put('/modificarContrasenna/:id_usuario', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const idParams = parseInt(req.params.id_usuario);
            if(req.session.idUsuario === idParams){
                const resultado = await usuarioCtrl.modificar(req.params.id_usuario, req.body)
                res.json(resultado);
            } else{
                res.status(400);
                res.send("No puede cambiar la contraseña de este usuario.");
            }
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

router.put('/restablecerContrasenna', jsonParser, async (req, res) => {
    try{
        const resp = await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        if(resp.exito){
            const resultado = await usuarioCtrl.restablecerContrasenna(req.body)
            res.json(resultado);
        } else { 
            console.log(resp);
            res.status(400);
            res.send(resp);    
        }
    }catch (err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para eliminar un usuario, en la dirección
// debe venir el id del usuario a eliminar.
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