const router = require('express').Router();
const activoCtlr = require('./ActivoControlador');


router.get('/:id_activo', (req, res) => {
    const activos = activoCtlr.consultar(req.params);
    res.json(activos);
});

router.get('/', async (req, res) => {
    const activos = activoCtlr.consultar(req.params);
    res.json(activos);
});

router.post('/', async (req, res) => {
    const activo_creado = activoCtlr.crear(req.body);
    res.json(activo_creado);
});

router.put('/:id_activo', async (req, res) => {
    const resultado = activoCtlr.modificar(req.params.id_activo, req.body)
    res.json(resultado);
});

router.delete('/:id_activo', async (req, res) => {
    const resultado = activoCtlr.eliminar(req.params.id_activo);
    res.json(resultado);
});

module.exports = router;