const router = require('express').Router();

const ActividadRouter = require('./ActividadRutas');
const AdministradorRouter = require('./AdministradorRutas');
const ActivoRouter = require('./ActivoRutas');
const JuntaDirectivaRouter = require('./JuntaDirectivaRutas');
const OrganizacionRouter = require('./OrganizacionRutas');
const PaginaRouter = require('./PaginaRutas');
const ProyectoRouter = require('./ProyectoRutas');
const UsuarioRouter = require('./UsuarioRutas');
const GastoRouter = require('./GastoRutas');

router.use('/actividad', ActividadRouter);
router.use('/administrador', AdministradorRouter);
router.use('/activo', ActivoRouter);
router.use('/administrador', ActivoRouter);
router.use('/juntaDirectiva', JuntaDirectivaRouter);
router.use('/organizacion', OrganizacionRouter);
router.use('/pagina', PaginaRouter);
router.use('/proyecto', ProyectoRouter);
router.use('/usuario', UsuarioRouter);
router.use('/gasto', GastoRouter);

module.exports = router;