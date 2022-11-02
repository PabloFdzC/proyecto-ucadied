const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const paginaCtlr = require('./PaginaControlador');
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');

router.get('/consultar/:id_pagina', async (req, res) => {
    try{
        var habilitado = false;
        var paginas = []
        if(req.session.idUsuario && req.session.idUsuario != -1){
            paginas = await paginaCtlr.consultar({id: req.params.id_pagina});
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else if(paginas.length === 1){
                const pagina = paginas[0];
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
            }
        }
        if(habilitado){
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
        var pagina_encontrada = false;
        var pagina;
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_organizacion){
            params.id_organizacion = req.query.id_organizacion;
        }
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                if(params.id_organizacion){
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, params.id_organizacion, "edita_pagina");
                }
                if(params.id){
                    pagina =  await paginaCtlr.consultar(req.query);
                    pagina_encontrada = true;
                    if(!habilitado){
                        if(pagina.length === 1){
                            habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, pagina[0].id_organizacion, "edita_pagina");
                        }
                    }
                }
            }
        }
        if(habilitado){
            if(pagina_encontrada){
                res.json(pagina);
            }
            else{
                const paginas = await paginaCtlr.consultar(params);
                res.json(paginas);
            }
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
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                habilitado = JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, "edita_pagina");
            }
        }
        var habilitado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            if(req.body.id_organizacion){
                habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_pagina");
            }
            else{
                error_encontrado = true;
                res.status(400);
                res.send("Parametros incorrectos");
            }
        }
        if(habilitado){
            const pagina_creada = await paginaCtlr.crear(req.body);
            res.json(pagina_creada);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
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
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const paginas = await paginaCtlr.consultar({id: req.params.id_pagina});
                if(paginas.length === 1){
                    const pagina = paginas[0];
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
                }
                else{
                    res.status(400);
                    res.send("No se encontró la página");
                    error_encontrado = true;
                }
            }
        }
        if(habilitado){
            const resultado = await paginaCtlr.modificar(req.params.id_pagina, req.body);
            res.json(resultado);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
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
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const paginas = await paginaCtlr.consultar({id: req.params.id_pagina});
                if(paginas.length === 1){
                    const pagina = paginas[0];
                    habilitado = await JuntaDirectivaCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
                }
                else{
                    res.status(400);
                    res.send("No se encontró la página");
                    error_encontrado = true;
                }
            }
        }
        if(habilitado){
            const resultado = await paginaCtlr.eliminar(req.params.id_pagina);
            res.json(resultado);
        }
        else{
            if(!error_encontrado){
                res.status(400);
                res.send("No se cuenta con los permisos necesarios");
            }
        }
    }catch(err){
        console.log(err);
        res.status(400);
        res.send("Algo salió mal");
    }
});

module.exports = router;