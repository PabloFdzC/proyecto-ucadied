const router = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const {CODIGO_STATUS_HTTP} = require('./respuestas.js');

const usuarioCtrl = require('./UsuarioControlador');

// Ruta para crear un administrador. Recibe la información del
// administrador en el body. Deja crear el administrador si está
// siendo creado por un administrador, o si no existe ningún
// administrador en el sistema.
router.post('/crear', jsonParser,  async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            req.body.tipo = "Administrador";
            req.body.id_organizacion = null;
            const usuario_creado = await usuarioCtrl.crear(req.body);
            res.json(usuario_creado);
        } else {
            const existeAdministrador = await usuarioCtrl.existeAdministrador();
            if(!existeAdministrador){
                req.body.tipo = "Administrador";
                req.body.id_organizacion = null;
                const usuario_creado = await usuarioCtrl.crear(req.body);
                res.json(usuario_creado);
            } else {
                throw {
                    errorConocido: true,
                    status: CODIGO_STATUS_HTTP.NO_AUTORIZADO,
                    error: "El usuario no es administrador"
                }
            }
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para saber si existe un administrador en el sistema o no.
router.get('/existeAdministrador', async (req, res) => {
    const existeAdministrador = await usuarioCtrl.existeAdministrador();
    res.send({existeAdministrador});
});

module.exports = router;