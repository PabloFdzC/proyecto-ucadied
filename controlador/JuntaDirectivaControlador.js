const router = require('express').Router();
const junta_directiva = require('../modelo/junta_directiva');

router.get('/:id_junta_directiva', async (req, res) => {
    const juntas_directivas = await junta_directiva.findAll({
        where: {id: req.params.id_junta_directiva}
    });
    res.json(juntas_directivas);
});

router.get('/', async (req, res) => {
    const juntas_directivas = await junta_directiva.findAll();
    res.json(juntas_directivas);
});

router.post('/', async (req, res) => {
    const junta_directiva_creada = await junta_directiva.create(req.body);
    res.json(junta_directiva_creada);
});

router.put('/:id_junta_directiva', async (req, res) => {
    await junta_directiva.update(req.body, {
        where: {id: req.params.id_junta_directiva}
    });
    res.json({success: "Junta directiva modificada"});
});

router.delete('/:id_junta_directiva', async (req, res) => {
    await junta_directiva.destroy({
        where: {id: req.params.id_junta_directiva}
    });
    res.json({success: "Junta directiva eliminada"});
});

module.exports = router;