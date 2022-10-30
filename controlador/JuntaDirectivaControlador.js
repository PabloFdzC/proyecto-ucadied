const puesto_jd = require('../modelo/puesto_jd');
const puesto_x_usuario = require('../modelo/puesto_x_usuario');
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');


async function consultar_puestos(id_organizacion){
    return await queries_generales.consultar(puesto_jd, {where: {
        id_organizacion
    }});
}

async function consultar_puesto(id){
    return await queries_generales.consultar(puesto_jd, {where: {
        id
    }});
}

async function crear_puesto(info){
    return await queries_generales.crear(puesto_jd, info);
}

async function crear_puestos(info){
    return await queries_generales.crear_varios(puesto_jd, info);
}

async function modificar_puesto(id, info){
    return await queries_generales.modificar(puesto_jd, {id}, info);
}

async function eliminar_puesto(id){
    return await queries_generales.eliminar(puesto_jd, {id});
}

async function agregar_miembro(info){
    return await queries_generales.crear(puesto_x_usuario, {
        id_usuario: info.id_usuario,
        id_puesto_jd: info.id_puesto_jd,
        id_organizacion: info.id_organizacion,
    });
}

async function eliminar_miembro(info){
    return await queries_generales.eliminar(puesto_x_usuario, {
        id_usuario: info.id_usuario,
        id_puesto_jd: info.id_puesto_jd,
    });
}

async function consultar_miembros(id_organizacion){
    return await queries_generales.consultar(puesto_x_usuario, {
        include: [
            {
                model: usuario,
                attributes: ["nombre"]
            },
            {model: puesto_jd}
        ],
        where: {
            id_organizacion
        }});
}

async function consultar_puestos_usuario(id_usuario){
    return await queries_generales.consultar(puesto_jd, {
        where: {
            '$puesto_x_usuarios.id_usuario$': id_usuario
        },
        include: {
            model: puesto_x_usuario,
            required: true
        }
    });
}

async function consultar_permisos(id_usuario, permiso){
    const puestos = await consultar_puestos_usuario(id_usuario);
    var puesto = {};
    for(var i = 0; i < puestos.length; i+=1){
        puesto = puestos[i];
        if(puesto[permiso]){
            return true;
        }
    }
    return false;
}

module.exports = {
    consultar_puestos,
    consultar_puestos_usuario,
    consultar_puesto,
    crear_puesto,
    crear_puestos,
    modificar_puesto,
    eliminar_puesto,
    agregar_miembro,
    eliminar_miembro,
    consultar_miembros,
    consultar_permisos
}