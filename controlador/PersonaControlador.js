const router = require('express').Router();
const persona = require('../modelo/persona');

router.get('/:id_persona', async (req, res) => {
    const personas = await persona.findAll({
        where: {id: req.params.id_persona}
    });
    res.json(personas);
});

router.get('/', async (req, res) => {
    const personas = await persona.findAll();
    res.json(personas);
});

router.post('/', async (req, res) => {
    const persona_creada = await persona.create(req.body);
    res.json(persona_creada);
});

router.put('/:id_persona', async (req, res) => {
    await persona.update(req.body, {
        where: {id: req.params.id_persona}
    });
    res.json({success: "Persona modificada"});
});

router.delete('/:id_persona', async (req, res) => {
    await persona.destroy({
        where: {id: req.params.id_persona}
    });
    res.json({success: "Persona eliminada"});
});

module.exports = router;