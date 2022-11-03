const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const componenteCtlr = require('./ComponenteControlador');
const puestoCtlr = require('./PuestoControlador');
const paginaCtlr = require('./PaginaControlador');

router.get('/consultar', async (req, res) => {
    try{
        var habilitado = false;
        var componentes_encontrados = false;
        var componentes = [];
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_pagina){
            params.id_pagina = req.query.id_pagina;
        }
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                var id_pagina = null;
                if(params.id_pagina){
                    id_pagina = params.id_pagina;
                }
                else if(params.id){
                    componentes = await componenteCtlr.consultar(params);
                    if(componentes.length === 1){
                        componentes_encontrados = true;
                        const componente = componentes[0];
                        id_pagina = componente.id_pagina;
                    }
                }
                if(params.id_pagina || componentes_encontrados){
                    const paginas = await paginaCtlr.consultar({id: id_pagina});
                    if(paginas.length === 1){
                        const pagina = paginas[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
                    }
                }
            }
        }
        if(habilitado){
            if(componentes_encontrados){
                res.json(componentes);
            }
            else{
                componentes = await componenteCtlr.consultar(params);
                res.json(componentes);
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
                if(req.body.id_pagina){
                    const paginas = await paginaCtlr.consultar({id: req.body.id_pagina});
                    if(paginas.length === 1){
                        const pagina = paginas[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
                    }
                    else{
                        error_encontrado = true;
                        res.status(400);
                        res.send("No se encontró la página");    
                    }
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("Parametros incorrectos");    
                }
            }
        }
        if(habilitado){
            const componente_creado = await componenteCtlr.crear(req.body);
            res.json(componente_creado);
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

router.put('/modificar/:id_componente', jsonParser, async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const componentes = await componenteCtlr.consultar({id: req.params.id_componente});
                if(componentes.length === 1){
                    const componente = componentes[0];
                    const paginas = await paginaCtlr.consultar({id: componente.id_pagina});
                    if(paginas.length === 1){
                        const pagina = paginas[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
                    }
                    else{
                        error_encontrado = true;
                        res.status(400);
                        res.send("No se encontró la página");    
                    }
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("No se encontró el componente");    
                }
            }
        }
        if(habilitado){
            const resultado = await componenteCtlr.modificar(req.params.id_componente, req.body)
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

router.delete('/eliminar/:id_componente', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(req.session.idUsuario && req.session.idUsuario != -1){
            if(req.session.tipoUsuario === "Administrador"){
                habilitado = true;
            }
            else{
                const componentes = await componenteCtlr.consultar({id: req.params.id_componente});
                if(componentes.length === 1){
                    const componente = componentes[0];
                    const paginas = await paginaCtlr.consultar({id: componente.id_pagina});
                    if(paginas.length === 1){
                        const pagina = paginas[0];
                        habilitado = await puestoCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
                    }
                    else{
                        error_encontrado = true;
                        res.status(400);
                        res.send("No se encontró la página");    
                    }
                }
                else{
                    error_encontrado = true;
                    res.status(400);
                    res.send("No se encontró el componente");    
                }
            }
        }
        if(habilitado){
            const resultado = await componenteCtlr.eliminar(req.params.id_componente);
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