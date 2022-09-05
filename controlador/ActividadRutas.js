const router = require('express').Router();
const actividadCtlr = require('./ActividadControlador');


router.get('/:id_actividad', (req, res) => {
    const actividades = actividadCtlr.consultar(req.params);
    res.json(actividades);
});

router.get('/', async (req, res) => {
    const actividades = actividadCtlr.consultar(req.params);
    res.json(actividades);
});

router.post('/', async (req, res) => {
    const actividad_creada = actividadCtlr.crear(req.body);
    res.json(actividad_creada);
});

router.put('/:id_actividad', async (req, res) => {
    const resultado = actividadCtlr.modificar(req.params.id_actividad, req.body)
    res.json(resultado);
});

router.delete('/:id_actividad', async (req, res) => {
    const resultado = actividadCtlr.eliminar(req.params.id_actividad);
    res.json(resultado);
});

module.exports = router;