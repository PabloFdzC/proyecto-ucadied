const actividad = require('../modelo/actividad');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_actividad){
        return await queries_generales.consultar(actividad, {where: {
            id: params.id_actividad
        }});
    }
    else{
        return await queries_generales.consultar(actividad, {});
    }
}

async function crear(info){
    return await queries_generales.crear(actividad, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(actividad, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(actividad, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}