const organizacion = require('../modelo/organizacion');
const persona = require('../modelo/persona');
const queries_generales = require('./QueriesGenerales');
const { Op } = require("sequelize");
const sequelize = require("sequelize");

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

async function consultarTipo(esUnion){
    if(esUnion === '1'){
        return await queries_generales.consultar(organizacion, {where: {
            id: {
                [Op.eq]: sequelize.col('id_organizacion')
            }
        }});
    }
    else{
        return await queries_generales.consultar(organizacion, {where: {
            id: {
                [Op.not]: sequelize.col('id_organizacion')
            }
        }});
    }
}

async function crear(info){
    const organizacion_creada = await queries_generales.crear(organizacion, info);
    if(!info.id_organizacion){
       await  modificar(organizacion_creada.id, {id_organizacion: organizacion_creada.id});
       organizacion_creada.id_organizacion = organizacion_creada.id;
    }
    return organizacion_creada;
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
    consultarTipo,
    crear,
    modificar,
    eliminar,
    agregarMiembro,
    eliminarMiembro,
    consultarMiembros
}