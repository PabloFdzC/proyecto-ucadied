const router = require('express').Router();
const personaCtrl = require('./PersonaControlador');

router.get('/:id_persona', (req, res) => {
    const personas = personaCtrl.consultar(req.params);
    res.json(personas);
});

router.get('/', async (req, res) => {
    const personas = personaCtrl.consultar(req.params);
    res.json(personas);
});

router.post('/', async (req, res) => {
    const persona_creada = personaCtrl.crear(req.body);
    res.json(persona_creada);
});

router.put('/:id_persona', async (req, res) => {
    const resultado = personaCtrl.modificar(req.params.id_persona, req.body)
    res.json(resultado);
});

router.delete('/:id_persona', async (req, res) => {
    const resultado = personaCtrl.eliminar(req.params.id_persona);
    res.json(resultado);
});

module.exports = router;