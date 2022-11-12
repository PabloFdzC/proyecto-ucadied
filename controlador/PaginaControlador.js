const pagina = require('../modelo/pagina');
const multimedia = require('../modelo/multimedia');
const queries_generales = require('./QueriesGenerales');
const fs = require('fs');

// Función para consultar un conjunto de páginas.
// Se debe enviar como parámetro los filtros de
// búsqueda.
async function consultar(params){
    return await queries_generales.consultar(pagina,
        {
            where: params
        });
}

// Función para crear una página. Recibe como parámetro
// la información de la página.
async function crear(info){
    return await queries_generales.crear(pagina, info);
}

// Función para modificar una página. Recibe como parámetros
// el id de la página y la información a modificar.
async function modificar(id, info){
    return await queries_generales.modificar(pagina, {id}, info)
}

// Función para eliminar una página. Recibe como parámetro
// el id de la página.
async function eliminar(id){
    return await queries_generales.eliminar(pagina, {id});
}

// Función para guardar los archivos en la base de datos
// recibe una lista con los archivos y el id de la organización.
async function crear_archivos(archivos, id_organizacion){
    let archivo = {}
    for(var i = 0; i < archivos.length; i+=1){
        archivo = {
            url: "archivos/" + archivos[i].filename,
            tipo: asignar_tipo(archivos[i].mimetype),
            id_organizacion
        }
        await queries_generales.crear(multimedia, archivo);
    }
    return {success: "Archivos guardados"};
}

// Le asigna el tipo a los archivos, pueden ser imágenes
// o videos.
function asignar_tipo(tipo){
    if (tipo === "image/png" || tipo === "image/jpg" || tipo === "image/jpeg" || tipo === 'image/gif'){
        return "Imagen";
    }
    else{
        return "Video";
    }
}

// Función para eliminar archivos de la
// carpeta archivos.
async function eliminar_archivos(archivos){
    for(var i = 0; i < archivos.length; i+=1){
        fs.unlink(archivos[i].path, (error) => {});
    }
    return
}

// Función para consultar un conjunto de archivos.
// Se debe enviar como parámetro los filtros de
// búsqueda.
async function consultar_archivos(params){
    return await queries_generales.consultar(multimedia,
        {
            where: params
        });
}

// Función para eliminar un archivo de la
// base de datos, recibe el id del archivo.
async function eliminar_archivo(id){
    return await queries_generales.eliminar(multimedia, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar,
    crear_archivos,
    eliminar_archivos,
    consultar_archivos,
    eliminar_archivo
}