const router = require('express').Router();
const organizacion = require('../modelo/organizacion');

router.get('/:id_organizacion', async (req, res) => {
    const organizaciones = await organizacion.findAll({
        where: {id: req.params.id_organizacion}
    });
    res.json(organizaciones);
});

router.get('/', async (req, res) => {
    const organizaciones = await organizacion.findAll();
    res.json(organizaciones);
});

router.post('/', async (req, res) => {
    const organizacion_creada = await organizacion.create(req.body);
    res.json(organizacion_creada);
});

router.put('/:id_organizacion', async (req, res) => {
    await organizacion.update(req.body, {
        where: {id: req.params.id_organizacion}
    });
    res.json({success: "Organización modificada"});
});

router.delete('/:id_organizacion', async (req, res) => {
    await organizacion.destroy({
        where: {id: req.params.id_organizacion}
    });
    res.json({success: "Organización eliminada"});
});

module.exports = router;