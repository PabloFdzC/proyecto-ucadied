const persona = require('../modelo/persona');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_persona){
        return await queries_generales.consultar(persona, {where: {
            id: params.id_persona
        }});
    }
    else{
        return await queries_generales.consultar(persona, {});
    }
}

async function crear(info){
    return await queries_generales.crear(persona, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(persona, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(persona, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}