const componente = require('../modelo/componente');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    return await queries_generales.consultar(componente, {where:params});
}

async function crear(info){
    return await queries_generales.crear(componente, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(componente, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(componente, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}