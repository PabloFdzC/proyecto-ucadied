const junta_directiva = require('../modelo/junta_directiva');
const puesto_jd = require('../modelo/puesto_jd');
const usuario = require('../modelo/usuario');
const persona = require('../modelo/persona');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_junta_directiva){
        return await queries_generales.consultar(junta_directiva, {where: {
            id: params.id_junta_directiva
        }});
    }
    else{
        return await queries_generales.consultar(junta_directiva, {});
    }
}

async function consultar_puestos(id_junta_directiva){
    return await queries_generales.consultar(puesto_jd, {where: {
        id_junta_directiva
    }});
}

async function consultar_puesto(id){
    return await queries_generales.consultar(puesto_jd, {where: {
        id
    }});
}

async function crear(info){
    return await queries_generales.crear(junta_directiva, info);
}

async function crear_puesto(info){
    return await queries_generales.crear(puesto_jd, info);
}

async function modificar_puesto(id, info){
    return await queries_generales.modificar(puesto_jd, id, info);
}

async function eliminar_puesto(id){
    return await queries_generales.eliminar(puesto_jd, {id});
}

async function modificar(id, info){
    return await queries_generales.modificar(junta_directiva, id, info);
}

async function eliminar(id){
    return await queries_generales.eliminar(junta_directiva, {id});
}

async function agregar_miembro(info){
    return await queries_generales.modificar(puesto_jd, info.id_puesto, {id_usuario: info.id_usuario});
}

async function eliminar_miembro(id_puesto){
    return await queries_generales.modificar(puesto_jd, id_puesto, {id_usuario: null});
}

async function consultar_miembros(id_junta_directiva){
    return await queries_generales.consultar(puesto_jd, {
        include: [{
            model: usuario,
            include: [{model: persona}]
        }],
        where: {
            id_junta_directiva
        }});
}

module.exports = {
    consultar,
    consultar_puestos,
    consultar_puesto,
    crear,
    crear_puesto,
    modificar_puesto,
    eliminar_puesto,
    modificar,
    eliminar,
    agregar_miembro,
    eliminar_miembro,
    consultar_miembros
}