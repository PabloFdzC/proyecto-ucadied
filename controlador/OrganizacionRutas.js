const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const organizacionCtrl = require('./OrganizacionControlador');
const nodemailer = require('nodemailer');
const {estaUsuarioLoggeado,CODIGO_STATUS_HTTP, mapearError} = require('./respuestas');
const { verificarCaptcha } = require('./captcha');


// Ruta para consultar todas las organizaciones.
router.get('/consultar', async (req, res) => {
    try{
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_organizacion){
            params.id_organizacion = req.query.id_organizacion;
        }
        const organizaciones = await organizacionCtrl.consultar(params);
        res.json(organizaciones);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para consultar las organizaciones de un tipo.
// Se manda en la dirección un 1 si se desea consultar
// uniones y un 0 si se desea consultar asociaciones.
router.get('/consultarTipo/:esUnion', async (req, res) => {
    try{
        const organizaciones = await organizacionCtrl.consultarTipo(req.params.esUnion);
        res.json(organizaciones);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para crear una organización. Se debe mandar la
// información de la organización como body.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req) && req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            const organizacion_creada = await organizacionCtrl.crear(req.body);
            res.json(organizacion_creada);
        }
        else{
            throw {
                errorConocido: true,
                status: CODIGO_STATUS_HTTP.NO_AUTORIZADO,
                error: "Usuario no es administrador"
            }
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para modificar una organización. Se manda en la dirección
// el id de la organización y en el body la información a modificar.
router.put('/modificar/:id_organizacion', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_junta");
            }

            res.json(await organizacionCtrl.modificar(req.params.id_organizacion, req.body));
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar una organización. Se manda en la dirección
// el id de la organización.
router.delete('/eliminar/:id_organizacion', async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            res.json(await organizacionCtrl.eliminar(req.params.id_organizacion));
        }
        else{
            throw {
                errorConocido: true,
                status: CODIGO_STATUS_HTTP.NO_AUTORIZADO,
                error: "Usuario no es administrador"
            }
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para agregar un miembro a una organización. En el body debe
// venir el id del usuario y el id de la organziación.
router.post('/agregarMiembro', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_junta");
            }

            const miembro_agregado = await organizacionCtrl.agregarMiembro(req.body);
            res.json(miembro_agregado);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar un miembro de una organización. En el body debe
// venir el id del usuario y el id de la organziación.
router.delete('/eliminarMiembro', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_junta");
            }

            res.json(await organizacionCtrl.eliminarMiembro(req.body.id_usuario));
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para consultar los miembros de una organización. Se debe
// enviar en la dirección el id de la organización.
router.get('/consultarMiembros/:id_organizacion', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, inmueble.id_organizacion, "edita_junta");
            }

            const miembros = await organizacionCtrl.consultarMiembros(req.params.id_organizacion);
            res.json(miembros);
        }
    }catch(err){
        mapearError(res, err);
    }
});

router.post('/externoEnviaCorreo', jsonParser, async (req, res) => {
    try{
        await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        const correo = await organizacionCtrl.externoEnviaCorreo(req.body);
        res.json(correo);
    }catch(err){
        mapearError(res, err);
    }
});

module.exports = router;