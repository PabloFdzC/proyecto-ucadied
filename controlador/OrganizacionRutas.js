const router = require('express').Router();
const organizacionCtrl = require('./OrganizacionControlador');


router.get('/:id_organizacion', (req, res) => {
    const organizaciones = organizacionCtrl.consultar(req.params);
    res.json(organizaciones);
});

router.get('/', async (req, res) => {
    const organizaciones = organizacionCtrl.consultar(req.params);
    res.json(organizaciones);
});

router.post('/', async (req, res) => {
    const organizacion_creada = organizacionCtrl.crear(req.body);
    res.json(organizacion_creada);
});

router.put('/:id_organizacion', async (req, res) => {
    const resultado = organizacionCtrl.modificar(req.params.id_organizacion, req.body)
    res.json(resultado);
});

router.delete('/:id_organizacion', async (req, res) => {
    const resultado = organizacionCtrl.eliminar(req.params.id_organizacion);
    res.json(resultado);
});

module.exports = router;