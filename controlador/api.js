const router = require('express').Router();

const ActividadRouter = require('./ActividadRutas');
const AdministradorRouter = require('./AdministradorRutas');
const InmuebleRouter = require('./InmuebleRutas');
const JuntaDirectivaRouter = require('./JuntaDirectivaRutas');
const OrganizacionRouter = require('./OrganizacionRutas');
const PaginaRouter = require('./PaginaRutas');
const ComponenteRouter = require('./ComponenteRutas');
const ProyectoRouter = require('./ProyectoRutas');
const UsuarioRouter = require('./UsuarioRutas');
const GastoRouter = require('./GastoRutas');

router.use('/actividad', ActividadRouter);
router.use('/administrador', AdministradorRouter);
router.use('/inmueble', InmuebleRouter);
router.use('/juntaDirectiva', JuntaDirectivaRouter);
router.use('/organizacion', OrganizacionRouter);
router.use('/pagina', PaginaRouter);
router.use('/componente', ComponenteRouter);
router.use('/proyecto', ProyectoRouter);
router.use('/usuario', UsuarioRouter);
router.use('/gasto', GastoRouter);

module.exports = router;