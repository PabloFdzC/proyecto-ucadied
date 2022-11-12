const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const organizacionCtrl = require('./OrganizacionControlador');
const nodemailer = require('nodemailer');

// Ruta para consultar una organización en específico.
// Se manda el id de la organización en la dirección.
router.get('/consultar/:id_organizacion', async (req, res) => {
    try{
        const organizaciones = await organizacionCtrl.consultar(req.params);
        res.json(organizaciones);
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

// Ruta para consultar todas las organizaciones.
router.get('/consultar', async (req, res) => {
    try{
        const organizaciones = await organizacionCtrl.consultar(req.params);
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

// Ruta para el form de contáctenos. En el body debe venir la información
// escrita en el form. Se envía un correo a la organización y también
// un correo de confirmación a la persona que manda la información.
router.post('/formContactenos', jsonParser, async (req, res) => {
    try{
        if(req.body.id_organizacion){
            const organizaciones = await organizacionCtrl.consultar({id_organizacion: req.body.id_organizacion});
            if(organizaciones.length === 1){
                const organizacion = organizaciones[0];
                if(req.body.nombre && req.body.email && req.body.telefono && req.body.mensaje){
                    var error_encontrado = false;
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                        user: 'sistemaucadied@gmail.com',
                        pass: 'bxlumqofylsqxqjk'
                        }
                    });
                    var mailOptions = {
                        from: 'sistemaucadied@gmail.com',
                        to: organizacion.email,
                        subject: 'Formulario Contáctenos',
                        html: `
                        <div>
                        <span>Acaba de recibir un mensaje en el formulario de contáctenos de su organización con la siguiente información:</span>
                        </div>
                        <div>
                            <h1>Nombre:</h1>
                            <p>${req.body.nombre}<p>
                            <h1>Email:</h1>
                            <p>${req.body.email}<p>
                            <h1>Teléfono:</h1>
                            <p>${req.body.telefono}<p>
                            <h1>Mensaje:</h1>
                            <p>${req.body.mensaje}<p>
                        </div>
                        <p>Este es un mensaje automatizado, favor no responder a esta dirección.<p>
                        `
                    };
                    transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                            error_encontrado = true;
                        }
                    });
                    if(!error_encontrado){
                        mailOptions = {
                            from: 'sistemaucadied@gmail.com',
                            to: req.body.email,
                            subject: 'Formulario contáctenos enviado correctamente',
                            html: `
                            <div>
                            <span>Su formulario de contáctenos fue enviado correctamente con la siguiente información:</span>
                            </div>
                            <div>
                                <h1>Nombre:</h1>
                                <p>${req.body.nombre}<p>
                                <h1>Email:</h1>
                                <p>${req.body.email}<p>
                                <h1>Teléfono:</h1>
                                <p>${req.body.telefono}<p>
                                <h1>Mensaje:</h1>
                                <p>${req.body.mensaje}<p>
                            </div>
                            <p>Este es un mensaje automatizado, favor no responder a esta dirección.<p>
                            `
                        };
                        transporter.sendMail(mailOptions, function(error, info){
                            if (error) {
                                console.log(error);
                                error_encontrado = true;
                                res.status(400);
                                res.send("Algo salió mal");
                            } else {
                                console.log('Email sent: ' + info.response);
                                res.send({success: "Email enviado"});
                            }
                        });
                    }
                    else {
                        res.status(400);
                        res.send("Algo salió mal");
                    }
                }
                else{
                    res.status(400);
                    res.send("Parámetros incorrectos");
                }
            }
            else{
                res.status(400);
                res.send("Organización no encontrada");
            }
        }
        else{
            res.status(400);
            res.send("Parámetros incorrectos");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;