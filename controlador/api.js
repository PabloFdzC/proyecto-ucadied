const router = require('express').Router();

const ActividadRouter = require('./ActividadControlador');
const ActivoRouter = require('./ActivoControlador');
const JuntaDirectivaRouter = require('./JuntaDirectivaControlador');
const OrganizacionRouter = require('./OrganizacionRutas');
const PaginaRouter = require('./PaginaRutas');
const PersonaRouter = require('./PersonaRutas');
const ProyectoRouter = require('./ProyectoRutas');
const UsuarioRouter = require('./UsuarioRutas');

router.use('/actividad', ActividadRouter);
router.use('/activo', ActivoRouter);
router.use('/junta_directiva', JuntaDirectivaRouter);
router.use('/organizacion', OrganizacionRouter);
router.use('/pagina', PaginaRouter);
router.use('/persona', PersonaRouter);
router.use('/proyecto', ProyectoRouter);
router.use('/usuario', UsuarioRouter);

module.exports = router;