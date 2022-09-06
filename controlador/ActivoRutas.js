const router = require('express').Router();
const activoCtlr = require('./ActivoControlador');


router.get('/consultar/:id_activo', (req, res) => {
    const activos = activoCtlr.consultar(req.params);
    res.json(activos);
});

router.get('/consultar', async (req, res) => {
    const activos = activoCtlr.consultar(req.params);
    res.json(activos);
});

router.post('/crear', async (req, res) => {
    const activo_creado = activoCtlr.crear(req.body);
    res.json(activo_creado);
});

router.put('/modificar/:id_activo', async (req, res) => {
    const resultado = activoCtlr.modificar(req.params.id_activo, req.body)
    res.json(resultado);
});

router.delete('/eliminar/:id_activo', async (req, res) => {
    const resultado = activoCtlr.eliminar(req.params.id_activo);
    res.json(resultado);
});

module.exports = router;