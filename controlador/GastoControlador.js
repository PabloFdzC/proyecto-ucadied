const gasto = require('../modelo/gasto');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_gasto){
        return await queries_generales.consultar(gasto, {where: {
            id: params.id_gasto
        }});
    }
    if(params.id_proyecto){
        return await queries_generales.consultar(gasto, {where: {
            id_proyecto: params.id_proyecto
        }});
    }
    else{
        return await queries_generales.consultar(gasto, {});
    }
}

async function crear(info){
    return await queries_generales.crear(gasto, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(gasto, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(gasto, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}