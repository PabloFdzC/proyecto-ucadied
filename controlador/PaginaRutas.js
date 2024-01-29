const router = require('express').Router();
const bodyParser = require('body-parser');
const jsonParser  = bodyParser.json({ extended: false });
const paginaCtlr = require('./PaginaControlador');
const puestoCtlr = require('./PuestoControlador');
const multer = require('multer');
const path = require('path');
const {estaUsuarioLoggeado, mapearError} = require('./respuestas');

// Se define la carpeta donde se guardan los archivos
// y se define el nombre que tendrán.
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../archivos/Imagen'))
    },
    filename: function (req, file, cb) {
            cb(null, "archivo_" + Date.now() + file.originalname.match(/\..*$/)[0])
    }
});

// Se definen los formatos que pueden tener los archivos
// y se define un límite de 10 archivos.
const multi_upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg" || file.mimetype === 'image/gif' ||
        file.mimetype === 'video/mp4' || file.mimetype === 'video/avi' || file.mimetype === 'video/mkv' || file.mimetype === 'video/mov') {
            cb(null, true);
        } else {
            console.log(file.mimetype);
            cb(null, false);
            const err = new Error('Solo se aceptan formatos .jpg, .jpeg, png, .gif, .mp4, .avi, .mkv y .mov')
            err.name = 'ExtensionError'
            return cb(err);
        }
    },
}).array('archivos', 10)

// Ruta para consultar un conjunto de páginas.
// Se pueden mandar parámetros por medio de variables
// en la dirección. Dentro de estos parámetros está el
// id de la página y el id de la organización.
router.get('/consultar', async (req, res) => {
    try{
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_organizacion){
            params.id_organizacion = req.query.id_organizacion;
        }
        if(req.query.nombre){
            params.nombre = req.query.nombre;
        }
        const paginas = await paginaCtlr.consultar(params);
        res.json(paginas);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para crear una página. Se debe mandar la
// información de la página como body. Revisa antes 
// de crear la página que el usuario tenga el 
// permiso de modificar páginas dentro de la organización.
router.post('/crear', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_pagina");
            }

            const pagina_creada = await paginaCtlr.crear(req.body);
            res.json(pagina_creada);
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para modificar una página. Se manda en la dirección
// el id de la página y en el body la información a modificar.
// Revisa antes de modificar la página que el usuario
// tenga el permiso de modificar páginas dentro de la organización.
router.put('/modificar/:id_pagina', jsonParser, async (req, res) => {
    try{
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const paginas = await paginaCtlr.consultar({id: req.params.id_pagina});

                const pagina = paginas[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
            }

            res.json(await paginaCtlr.modificar(req.params.id_pagina, req.body));
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar una página. Se manda en la dirección
// el id de la página. Revisa antes de eliminar la página 
// que el usuario tenga el permiso de modificar páginas dentro 
// de la organización.
router.delete('/eliminar/:id_pagina', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const paginas = await paginaCtlr.consultar({id: req.params.id_pagina});

                const pagina = paginas[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, pagina.id_organizacion, "edita_pagina");
            }

            res.json(await paginaCtlr.eliminar(req.params.id_pagina));
        }
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para subir archivos al servidor y guardarlos
// en la base de datos, además, en el body debe venir
// el id de la organización. Primero se busca si el
// usuario tiene el permiso de editar páginas en la
// organización.
router.post('/subirArchivos', multi_upload, async (req, res) => {
    try{
        var error_encontrado = false;
        var habilitado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                await puestoCtlr.consultar_permisos(req.session.idUsuario, req.body.id_organizacion, "edita_pagina");
            }

            res.json(await paginaCtlr.crear_archivos(req.files, req.body.id_organizacion));
        }
    }catch(err){
        paginaCtlr.eliminar_archivos(req.files);
        mapearError(res, err);
    }
});

// Ruta para consultar un conjunto de archivos.
// Se pueden mandar parámetros por medio de variables
// en la dirección. Dentro de estos parámetros está el
// id del archivo y el id de la organización.
router.get('/consultarArchivos', async (req, res) => {
    try{
        var params = {};
        if(req.query.id){
            params.id = req.query.id;
        }
        if(req.query.id_organizacion){
            params.id_organizacion = req.query.id_organizacion;
        }
        const archivos = await paginaCtlr.consultar_archivos(params);
        res.json(archivos);
    }catch(err){
        mapearError(res, err);
    }
});

// Ruta para eliminar un archivo. Se manda en la dirección
// el id del archivo. Revisa antes de eliminar el archivo 
// que el usuario tenga el permiso de modificar páginas dentro 
// de la organización.
router.delete('/eliminarArchivo/:id_archivo', async (req, res) => {
    try{
        var habilitado = false;
        var error_encontrado = false;
        if(estaUsuarioLoggeado(req)){
            if(req.session.tipoUsuario !== "Administrador"){
                const archivos = await paginaCtlr.consultar_archivos({id: req.params.id_archivo});

                const archivo = archivos[0];
                await puestoCtlr.consultar_permisos(req.session.idUsuario, archivo.id_organizacion, "edita_pagina");
            }

            res.json(await paginaCtlr.eliminar_archivo(req.params.id_archivo));
        }
    }catch(err){
        mapearError(res, err);
    }
});

module.exports = router;