const router = require('express').Router();
const proyecto = require('../modelo/proyecto');

router.get('/:id_proyecto', async (req, res) => {
    const proyectos = await proyecto.findAll({
        where: {id: req.params.id_proyecto}
    });
    res.json(proyectos);
});

router.get('/', async (req, res) => {
    const proyectos = await proyecto.findAll();
    res.json(proyectos);
});

router.post('/', async (req, res) => {
    const proyecto_creada = await proyecto.create(req.body);
    res.json(proyecto_creada);
});

router.put('/:id_proyecto', async (req, res) => {
    await proyecto.update(req.body, {
        where: {id: req.params.id_proyecto}
    });
    res.json({success: "Proyecto modificado"});
});

router.delete('/:id_proyecto', async (req, res) => {
    await proyecto.destroy({
        where: {id: req.params.id_proyecto}
    });
    res.json({success: "Proyecto eliminado"});
});

module.exports = router;