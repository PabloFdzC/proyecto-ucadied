const router = require('express').Router();
const pagina = require('../modelo/pagina');

router.get('/:id_pagina', async (req, res) => {
    const paginas = await pagina.findAll({
        where: {id: req.params.id_pagina}
    });
    res.json(paginas);
});

router.get('/', async (req, res) => {
    const paginas = await pagina.findAll();
    res.json(paginas);
});

router.post('/', async (req, res) => {
    const pagina_creada = await pagina.create(req.body);
    res.json(pagina_creada);
});

router.put('/:id_pagina', async (req, res) => {
    await pagina.update(req.body, {
        where: {id: req.params.id_pagina}
    });
    res.json({success: "Página modificada"});
});

router.delete('/:id_pagina', async (req, res) => {
    await pagina.destroy({
        where: {id: req.params.id_pagina}
    });
    res.json({success: "Página eliminada"});
});

module.exports = router;