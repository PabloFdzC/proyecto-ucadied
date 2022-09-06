const router = require('express').Router();
const usuarioCtrl = require('./UsuarioControlador');

router.get('/consultar/:id_usuario', (req, res) => {
    const usuario = usuarioCtrl.consultar(req.params);
    res.json(usuario);
});

router.get('/consultar', async (req, res) => {
    const usuarios = usuarioCtrl.consultar(req.params);
    res.json(usuarios);
});

router.post('/crear', async (req, res) => {
    req.body.tipo = "Usuario";
    const usuario_creado = usuarioCtrl.crear(req.body);
    res.json(usuario_creado);
});

router.post('/iniciarSesion', async (req, res) => {
    const resultado = usuarioCtrl.iniciarSesion(req.body);
    req.session.id = resultado.id;
    req.session.tipoUsuario = resultado.tipo;
    res.json(resultado);
});

router.put('/modificar/:id_usuario', async (req, res) => {
    const resultado = usuarioCtrl.modificar(req.params.id_usuario, req.body)
    res.json(resultado);
});

router.delete('/eliminar/:id_usuario', async (req, res) => {
    const resultado = usuarioCtrl.eliminar(req.params.id_usuario);
    res.json(resultado);
});

module.exports = router;