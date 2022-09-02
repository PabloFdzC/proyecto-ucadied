const router = require('express').Router();
const actividad = require('../modelo/actividad');

router.get('/:id_actividad', async (req, res) => {
    const actividades = await actividad.findAll({
        where: {id: req.params.id_actividad}
    });
    res.json(actividades);
});

router.get('/', async (req, res) => {
    const actividades = await actividad.findAll();
    res.json(actividades);
});

router.post('/', async (req, res) => {
    const actividad_creada = await actividad.create(req.body);
    res.json(actividad_creada);
});

router.put('/:id_actividad', async (req, res) => {
    await actividad.update(req.body, {
        where: {id: req.params.id_actividad}
    });
    res.json({success: "Actividad modificada"});
});

router.delete('/:id_actividad', async (req, res) => {
    await actividad.destroy({
        where: {id: req.params.id_actividad}
    });
    res.json({success: "Actividad eliminada"});
});

module.exports = router;