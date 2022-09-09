const organizacion = require('../modelo/organizacion');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_organizacion){
        return await queries_generales.consultar(organizacion, {where: {
            id: params.id_organizacion
        }});
    }
    else{
        return await queries_generales.consultar(organizacion, {});
    }
}

async function crear(info){
    return await queries_generales.crear(organizacion, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(organizacion, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(organizacion, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}