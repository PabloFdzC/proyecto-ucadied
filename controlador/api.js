const router = require('express').Router();

const ActividadRouter = require('./ActividadRutas');
const AdministradorRouter = require('./AdministradorRutas');
const ActivoRouter = require('./ActivoRutas');
const JuntaDirectivaRouter = require('./JuntaDirectivaRutas');
const OrganizacionRouter = require('./OrganizacionRutas');
const PaginaRouter = require('./PaginaRutas');
const PersonaRouter = require('./PersonaRutas');
const ProyectoRouter = require('./ProyectoRutas');
const UsuarioRouter = require('./UsuarioRutas');

router.use('/actividad', ActividadRouter);
router.use('/administrador', AdministradorRouter);
router.use('/activo', ActivoRouter);
router.use('/administrador', ActivoRouter);
router.use('/juntaDirectiva', JuntaDirectivaRouter);
router.use('/organizacion', OrganizacionRouter);
router.use('/pagina', PaginaRouter);
router.use('/persona', PersonaRouter);
router.use('/proyecto', ProyectoRouter);
router.use('/usuario', UsuarioRouter);

module.exports = router;