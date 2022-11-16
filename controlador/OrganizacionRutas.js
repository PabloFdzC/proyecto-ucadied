const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const organizacionCtrl = require('./OrganizacionControlador');
const nodemailer = require('nodemailer');


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
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
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
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para crear una organización. Se debe mandar la
// información de la organización como body.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            const organizacion_creada = await organizacionCtrl.crear(req.body);
            res.json(organizacion_creada);
        }
        else{
            res.status(400);
            res.send("Usuario no administrador"+ req.session.tipoUsuario);
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para modificar una organización. Se manda en la dirección
// el id de la organización y en el body la información a modificar.
router.put('/modificar/:id_organizacion', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await organizacionCtrl.modificar(req.params.id_organizacion, req.body)
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para eliminar una organización. Se manda en la dirección
// el id de la organización.
router.delete('/eliminar/:id_organizacion', async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            const resultado = await organizacionCtrl.eliminar(req.params.id_organizacion);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Usuario no administrador");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para agregar un miembro a una organización. En el body debe
// venir el id del usuario y el id de la organziación.
router.post('/agregarMiembro', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const miembro_agregado = await organizacionCtrl.agregarMiembro(req.body);
            res.json(miembro_agregado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para eliminar un miembro de una organización. En el body debe
// venir el id del usuario y el id de la organziación.
router.delete('/eliminarMiembro', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const resultado = await organizacionCtrl.eliminarMiembro(req.body.id_usuario);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para consultar los miembros de una organización. Se debe
// enviar en la dirección el id de la organización.
router.get('/consultarMiembros/:id_organizacion', jsonParser, async (req, res) => {
    try{
        if(req.session.idUsuario && req.session.idUsuario != -1){
            const miembros = await organizacionCtrl.consultarMiembros(req.params.id_organizacion);
            res.json(miembros);
        }
        else{
            res.status(400);
            res.send("Sesión no iniciada");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/externoEnviaCorreo', jsonParser, async (req, res) => {
    try{
        const resp = await verificarCaptcha(req.body.captcha);
        delete req.body.captcha;
        if(resp.exito){
            const correo = await organizacionCtrl.externoEnviaCorreo(req.body);
            res.json(correo);
        } else { 
            console.log(resp);
            res.status(400);
            res.send(resp);    
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;