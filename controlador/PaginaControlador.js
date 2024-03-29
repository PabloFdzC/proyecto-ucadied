const pagina = require('../modelo/pagina');
const multimedia = require('../modelo/multimedia');
const queries_generales = require('./QueriesGenerales');
const fs = require('fs');
const path = require('path');
const { verificarEncontrado } = require('./verificaErrores');

// Función para consultar un conjunto de páginas.
// Se debe enviar como parámetro los filtros de
// búsqueda.
async function consultar(params){
    const resultados = await queries_generales.consultar(pagina,
        {
            where: params
        });

    verificarEncontrado(resultados, "No se encontró la página");

    return resultados;
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
    const archivoParaSubir = [];
    for(var i = 0; i < archivos.length; i+=1){
        const tipo = asignar_tipo(archivos[i].mimetype);
        const archivo = {
            url: "archivos/"+ tipo+"/" + archivos[i].filename,
            tipo: tipo,
            id_organizacion
        }
        archivoParaSubir.push(archivo);
    }
    return await queries_generales.crear_varios(multimedia, archivoParaSubir);
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
    return;
}

// Función para consultar un conjunto de archivos.
// Se debe enviar como parámetro los filtros de
// búsqueda.
async function consultar_archivos(params){
    const resultados = await queries_generales.consultar(multimedia,
        {
            where: params
        });

    verificarEncontrado(resultados, "No se encontraron los archivos");
    
    return resultados;
}

// Función para eliminar un archivo de la
// base de datos, recibe el id del archivo.
async function eliminar_archivo(id){
    const archivo = await consultar_archivos({id});
    const lugar = path.join(__dirname, "../"+archivo[0].url);
    return fs.unlink(lugar, async (error) => {
        if(error){
            throw {error: "No se pudo eliminar el archivo."};
        }
        return await queries_generales.eliminar(multimedia, {id});
    });
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