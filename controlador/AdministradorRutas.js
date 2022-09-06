const router = require('express').Router();
const usuarioCtrl = require('./UsuarioControlador');

router.post('/crear', async (req, res) => {
    req.body.tipo = "Administrador";
    const usuario_creado = usuarioCtrl.crear(req.body);
    res.json(usuario_creado);
});

module.exports = router;