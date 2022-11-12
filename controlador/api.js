const router = require('express').Router();

const ActividadRouter = require('./ActividadRutas');
const AdministradorRouter = require('./AdministradorRutas');
const InmuebleRouter = require('./InmuebleRutas');
const PuestoRouter = require('./PuestoRutas');
const OrganizacionRouter = require('./OrganizacionRutas');
const PaginaRouter = require('./PaginaRutas');
const ProyectoRouter = require('./ProyectoRutas');
const UsuarioRouter = require('./UsuarioRutas');
const GastoRouter = require('./GastoRutas');

// El Api se utiliza para redireccionar al archivo correspondiente.

router.use('/actividad', ActividadRouter);
router.use('/administrador', AdministradorRouter);
router.use('/inmueble', InmuebleRouter);
router.use('/puesto', PuestoRouter);
router.use('/organizacion', OrganizacionRouter);
router.use('/pagina', PaginaRouter);
router.use('/proyecto', ProyectoRouter);
router.use('/usuario', UsuarioRouter);
router.use('/gasto', GastoRouter);

module.exports = router;