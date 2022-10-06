const proyecto = require('../modelo/proyecto');
const usuario = require('../modelo/usuario');
const proyecto_x_usuario = require('../modelo/proyecto_x_usuario');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    return await queries_generales.consultar(proyecto,
        {
            where: params,
            include: {
                model: usuario,
                attributes:["id","nombre"]
            }
        });
}

async function crear(info){
    const proyecto_creado = await queries_generales.crear(proyecto, info);
    if(info.encargados){
        await agregar_encargados(proyecto_creado.id, info.encargados);
    }
    return proyecto_creado;
}

async function agregar_encargados(id_proyecto, encargados){
    for(var i = 0; i < encargados.length; i+=1){
        await queries_generales.crear(proyecto_x_usuario, {
            id_proyecto,
            id_usuario: encargados[i]
        });
    }
}


async function modificar(id, info){
    return await queries_generales.modificar(proyecto, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(proyecto, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}