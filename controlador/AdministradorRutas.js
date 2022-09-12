const router = require('express').Router();

// estos no son necesarios ponerlos en todos si uno pone
// app.use(express.json()); en app.js

//const bodyParser = require('body-parser');
//const urlencodedParser  = bodyParser.urlencoded({ extended: false });

const usuarioCtrl = require('./UsuarioControlador');


router.post('/crear',  async (req, res) => {
    try{
        if(req.session.tipoUsuario && req.session.tipoUsuario === "Administrador"){
            req.body.tipo = "Administrador";
            const usuario_creado = await usuarioCtrl.crear(req.body);
            res.json(usuario_creado);
        }
        else{
            res.status(400);
            res.send("Usuario no administrador");
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