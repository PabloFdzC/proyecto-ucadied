const proyecto = require('../modelo/proyecto');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_activo){
        return await queries_generales.consultar(proyecto, {where: {
            id: params.id_proyecto
        }});
    }
    else{
        return await queries_generales.consultar(proyecto, {});
    }
}

async function crear(info){
    return await queries_generales.crear(proyecto, info);
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