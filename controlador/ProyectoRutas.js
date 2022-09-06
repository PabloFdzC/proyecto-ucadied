const router = require('express').Router();
const proyectoCtlr = require('./ProyectoControlador');


router.get('/consultar/:id_proyecto', (req, res) => {
    const proyectos = proyectoCtlr.consultar(req.params);
    res.json(proyectos);
});

router.get('/consultar', async (req, res) => {
    const proyectos = proyectoCtlr.consultar(req.params);
    res.json(proyectos);
});

router.post('/crear', async (req, res) => {
    const proyecto_creado = proyectoCtlr.crear(req.body);
    res.json(proyecto_creado);
});

router.put('/modificar/:id_proyecto', async (req, res) => {
    const resultado = proyectoCtlr.modificar(req.params.id_proyecto, req.body)
    res.json(resultado);
});

router.delete('/eliminar/:id_proyecto', async (req, res) => {
    const resultado = proyectoCtlr.eliminar(req.params.id_proyecto);
    res.json(resultado);
});

module.exports = router;