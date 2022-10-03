const gasto = require('../modelo/gasto');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    return await queries_generales.consultar(gasto, {where:params});
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