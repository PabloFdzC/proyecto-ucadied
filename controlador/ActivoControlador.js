const activo = require('../modelo/activo');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_activo){
        return await queries_generales.consultar(activo, {where: {
            id: params.id_activo
        }});
    }
    else{
        return await queries_generales.consultar(activo, {});
    }
}

async function crear(info){
    return await queries_generales.crear(activo, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(activo, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(activo, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}