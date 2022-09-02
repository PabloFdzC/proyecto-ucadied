const router = require('express').Router();

const ActividadRouter = require('./ActividadControlador');
const ActivoRouter = require('./ActivoControlador');
const JuntaDirectivaRouter = require('./JuntaDirectivaControlador');
const OrganizacionRouter = require('./OrganizacionControlador');
const PaginaRouter = require('./PaginaControlador');
const PersonaRouter = require('./PersonaControlador');
const ProyectoRouter = require('./ProyectoControlador');
const UsuarioRouter = require('./UsuarioControlador');

router.use('/actividad', ActividadRouter);
router.use('/activo', ActivoRouter);
router.use('/junta_directiva', JuntaDirectivaRouter);
router.use('/organizacion', OrganizacionRouter);
router.use('/pagina', PaginaRouter);
router.use('/persona', PersonaRouter);
router.use('/proyecto', ProyectoRouter);
router.use('/usuario', UsuarioRouter);

module.exports = router;