const router = require('express').Router();
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');


router.get('/:id_junta_directiva', (req, res) => {
    const juntas = JuntaDirectivaCtlr.consultar(req.params);
    res.json(juntas);
});

router.get('/', async (req, res) => {
    const juntas = JuntaDirectivaCtlr.consultar(req.params);
    res.json(juntas);
});

router.post('/', async (req, res) => {
    const junta_directiva_creada = JuntaDirectivaCtlr.crear(req.body);
    res.json(junta_directiva_creada);
});

router.put('/:id_junta_directiva', async (req, res) => {
    const resultado = JuntaDirectivaCtlr.modificar(req.params.id_junta_directiva, req.body)
    res.json(resultado);
});

router.delete('/:id_junta_directiva', async (req, res) => {
    const resultado = JuntaDirectivaCtlr.eliminar(req.params.id_junta_directiva);
    res.json(resultado);
});

module.exports = router;