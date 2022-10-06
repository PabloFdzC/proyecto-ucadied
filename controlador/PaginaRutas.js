const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const paginaCtlr = require('./PaginaControlador');
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');

router.get('/consultar/:id_pagina', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_pagina");
            }
        }
        if(habilitado){
            const paginas = await paginaCtlr.consultar(req.params);
            res.json(paginas);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.get('/consultar', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_pagina");
            }
        }
        if(habilitado){
            const paginas = await paginaCtlr.consultar(req.params);
            res.json(paginas);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.post('/crear', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_pagina");
            }
        }
        if(habilitado){
            const pagina_creada = await paginaCtlr.crear(req.body);
            res.json(pagina_creada);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.put('/modificar/:id_pagina', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_pagina");
            }
        }
        if(habilitado){
            const resultado = await paginaCtlr.modificar(req.params.id_pagina, req.body);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

router.delete('/eliminar/:id_pagina', async (req, res) => {
    try{
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_pagina");
            }
        }
        if(habilitado){
            const resultado = await paginaCtlr.eliminar(req.params.id_pagina);
            res.json(resultado);
        }
        else{
            res.status(400);
            res.send("No se cuenta con los permisos necesarios");
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;