const junta_directiva = require('../modelo/junta_directiva');
const puesto_jd = require('../modelo/puesto_jd');
const puesto_x_usuario = require('../modelo/puesto_x_usuario');
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_junta_directiva){
        return await queries_generales.consultar(junta_directiva, {
            where: {
                id_organizacion: params.id_organizacion
            }
        });
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
    return await queries_generales.crear(puesto_x_usuario, {
        id_usuario: info.id_usuario,
        id_puesto_jd: info.id_puesto_jd,
    });
}

async function eliminar_miembro(info){
    return await queries_generales.eliminar(puesto_x_usuario, {
        id_usuario: info.id_usuario,
        id_puesto_jd: info.id_puesto_jd,
    });
}

async function consultar_miembros(id_junta_directiva){
    return await queries_generales.consultar(puesto_jd, {
        include: [{
            model: puesto_x_usuario,
            include: [{model: usuario}]
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