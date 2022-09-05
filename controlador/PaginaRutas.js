const router = require('express').Router();
const paginaCtlr = require('./PaginaControlador');

router.get('/:id_pagina', (req, res) => {
    const paginas = paginaCtlr.consultar(req.params);
    res.json(paginas);
});

router.get('/', async (req, res) => {
    const paginas = paginaCtlr.consultar(req.params);
    res.json(paginas);
});

router.post('/', async (req, res) => {
    const pagina_creada = paginaCtlr.crear(req.body);
    res.json(pagina_creada);
});

router.put('/:id_pagina', async (req, res) => {
    const resultado = paginaCtlr.modificar(req.params.id_pagina, req.body)
    res.json(resultado);
});

router.delete('/:id_pagina', async (req, res) => {
    const resultado = paginaCtlr.eliminar(req.params.id_pagina);
    res.json(resultado);
});

module.exports = router;