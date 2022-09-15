const router = require('express').Router();

const bodyParser = require('body-parser');
const urlencodedParser  = bodyParser.urlencoded({ extended: false });

const usuarioCtrl = require('./UsuarioControlador');


router.post('/crear', urlencodedParser,  async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            req.body.tipo = "Administrador";
            const usuario_creado = await usuarioCtrl.crear(req.body);
            res.json(usuario_creado);
        }
        else{
            const admins = await usuarioCtrl.consultar({admin: true});
            if(admins.length === 0){
                req.body.tipo = "Administrador";
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

module.exports = router;