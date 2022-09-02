const router = require('express').Router();
const activo = require('../modelo/activo');

router.get('/:id_activo', async (req, res) => {
    const activos = await activo.findAll({
        where: {id: req.params.id_activo}
    });
    res.json(activos);
});

router.get('/', async (req, res) => {
    const activos = await activo.findAll();
    res.json(activos);
});

router.post('/', async (req, res) => {
    const activo_creada = await activo.create(req.body);
    res.json(activo_creada);
});

router.put('/:id_activo', async (req, res) => {
    await activo.update(req.body, {
        where: {id: req.params.id_activo}
    });
    res.json({success: "Activo modificado"});
});

router.delete('/:id_activo', async (req, res) => {
    await activo.destroy({
        where: {id: req.params.id_activo}
    });
    res.json({success: "Activo eliminado"});
});

module.exports = router;