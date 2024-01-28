const router = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const usuarioCtrl = require('./UsuarioControlador');
const { verificarCaptcha } = require('./captcha');
const {estaUsuarioLoggeado,CODIGO_STATUS_HTTP} = require('respuestas');
const { mapearError } = require('./respuestas');

// Ruta para saber si hay una sesión activa
// en el sistema.
router.get('/sesionActiva', async (req, res) => {
    try{
        res.send(estaUsuarioLoggeado(req));
    } catch(err){
        return false;
    }
});

// Ruta para consultar una lista de usuarios.
// Se pueden mandar diversos parámetros por
// medio de variables en la dirección, entre
// estos parámetros están el id, el id de la
// organización y el tipo.
router.get('/consultar', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
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
    }catch (err){
        mapearError(res, err);
    }
});

// Ruta para consultar un tipo de usuario.
// Se manda en la dirección un 1 si se desea
// consultar administradores y un 0 si se desea
// consultar usuarios normales.
router.get('/consultarTipo/:esAdmin', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            const usuarios = await usuarioCtrl.consultarTipo(req.params.esAdmin);
            res.json(usuarios);
        }
    }catch (err){
        mapearError(res, err);
    }
});

// Ruta para crear un usuario, en el body debe
// venir la información del usuario.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            req.body.tipo = "Usuario";
            const usuario_creado = await usuarioCtrl.crear(req.body);
            res.json(usuario_creado);
        }
    }catch (err){
        mapearError(res, err);
    }
});

// Ruta para iniciar sesión en el sistema.
// En el body debe venir el correo y la
// contraseña. La información del usuario
// se guarda en el session de express.
router.post('/iniciarSesion', jsonParser, async (req, res) => {
    try{
        const resultado = await usuarioCtrl.iniciarSesion(req.body);
        req.session.idUsuario = resultado.id_usuario;
        req.session.tipoUsuario = resultado.tipo;
        res.json(resultado);
    }catch (err){
        mapearError(res, err);
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
        mapearError(res, err);
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
        if(estaUsuarioLoggeado(req)){
            const resultado = await usuarioCtrl.modificar(req.params.id_usuario, req.body)
            res.json(resultado);
        }
    }catch (err){
        mapearError(res, err);
    }
});

// Ruta para modificar la contraseña de un usuario.
// En la dirección se debe mandar el id del usuario al
// que se le modifica la contraseña y en el body debe venir
// la contraseña nueva.
router.put('/modificarContrasenna/:id_usuario', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            const idParams = parseInt(req.params.id_usuario);
            if(req.session.idUsuario === idParams){
                const resultado = await usuarioCtrl.modificar(req.params.id_usuario, req.body)
                res.json(resultado);
            } else{
                throw {
                    errorConocido: true,
                    status:CODIGO_STATUS_HTTP.NO_AUTORIZADO,
                    error:"No puede cambiar la contraseña de este usuario"
                }
            }
        }
    }catch (err){
        mapearError(res, err);
    }
});

router.put('/restablecerContrasenna', jsonParser, async (req, res) => {
    try{
        const resp = await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        if(resp.exito){
            const resultado = await usuarioCtrl.restablecerContrasenna(req.body)
            res.json(resultado);
        }
    }catch (err){
        mapearError(res, err);
    }
});

// Ruta para eliminar un usuario, en la dirección
// debe venir el id del usuario a eliminar.
router.delete('/eliminar/:id_usuario', async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            const resultado = await usuarioCtrl.eliminar(req.params.id_usuario);
            res.json(resultado);
        }
    }catch (err){
        mapearError(res, err);
    }
});

module.exports = router;