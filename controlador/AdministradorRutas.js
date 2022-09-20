const router = require('express').Router();

const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });

const usuarioCtrl = require('./UsuarioControlador');


router.post('/crear', jsonParser,  async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            req.body.tipo = "Administrador";
            req.body.id_organizacion = null;
            const usuario_creado = await usuarioCtrl.crear(req.body);
            res.json(usuario_creado);
        }
        else{
            const existeAdministrador = await usuarioCtrl.existeAdministrador();
            if(!existeAdministrador){
                req.body.tipo = "Administrador";
                req.body.id_organizacion = null;
                const usuario_creado = await usuarioCtrl.crear(req.body);
                res.json(usuario_creado);
            } 
            else{
                res.status(400);
                res.send("Usuario no administrador");
            }
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }finally{
        res.end();
    }
});

router.get('/existeAdministrador', async (req, res) => {
    const existeAdministrador = await usuarioCtrl.existeAdministrador();
    res.send({existeAdministrador});
});

module.exports = router;