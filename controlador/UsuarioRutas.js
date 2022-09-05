const router = require('express').Router();
const usuarioCtrl = require('./UsuarioControlador');

router.get('/:id_usuario', (req, res) => {
    const usuario = usuarioCtrl.consultar(req.params);
    res.json(usuario);
});

router.get('/', async (req, res) => {
    const usuarios = usuarioCtrl.consultar(req.params);
    res.json(usuarios);
});

router.post('/', async (req, res) => {
    const usuario_creado = usuarioCtrl.crear(req.body);
    res.json(usuario_creado);
});

router.post('/iniciarSesion', async (req, res) => {
    const resultado = usuarioCtrl.iniciarSesion(req.body);
    res.json(resultado);
});

router.put('/:id_usuario', async (req, res) => {
    const resultado = usuarioCtrl.modificar(req.params.id_usuario, req.body)
    res.json(resultado);
});

router.delete('/:id_usuario', async (req, res) => {
    const resultado = usuarioCtrl.eliminar(req.params.id_usuario);
    res.json(resultado);
});

module.exports = router;