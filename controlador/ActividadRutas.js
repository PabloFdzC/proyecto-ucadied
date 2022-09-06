const router = require('express').Router();
const actividadCtlr = require('./ActividadControlador');


router.get('/consultar/:id_actividad', (req, res) => {
    const actividades = actividadCtlr.consultar(req.params);
    res.json(actividades);
});

router.get('/consultar', async (req, res) => {
    const actividades = actividadCtlr.consultar(req.params);
    res.json(actividades);
});

router.post('/crear', async (req, res) => {
    const actividad_creada = actividadCtlr.crear(req.body);
    res.json(actividad_creada);
});

router.put('/modificar/:id_actividad', async (req, res) => {
    const resultado = actividadCtlr.modificar(req.params.id_actividad, req.body)
    res.json(resultado);
});

router.delete('/eliminar/:id_actividad', async (req, res) => {
    const resultado = actividadCtlr.eliminar(req.params.id_actividad);
    res.json(resultado);
});

module.exports = router;