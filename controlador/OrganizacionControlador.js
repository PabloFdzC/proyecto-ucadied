const organizacion = require('../modelo/organizacion');
const persona = require('../modelo/persona');
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
    return await queries_generales.eliminar(organizacion, {id});
}

async function agregarMiembro(info){
    return await queries_generales.modificar(persona, info.id_persona, {id_organizacion: info.id_organizacion});
}

async function eliminarMiembro(id_persona){
    return await queries_generales.modificar(persona, id_persona, {id_organizacion: null});
}

async function consultarMiembros(id_organizacion){
    return await queries_generales.consultar(persona, {
        where: {
            id_organizacion
        }
    });
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar,
    agregarMiembro,
    eliminarMiembro,
    consultarMiembros
}