const puesto = require('../modelo/puesto');
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');

async function modificar_miembro(id_puesto, info){
    return await queries_generales.modificar(puesto, id_puesto, info);
}

async function agregar_miembro(info){
    return await queries_generales.crear(puesto, info);
}

async function agregar_miembros(info){
    return await queries_generales.crear_varios(puesto, info);
}

async function eliminar_miembro(info){
    return await queries_generales.eliminar(puesto, info);
}

async function consultar_miembros(params){
    return await queries_generales.consultar(puesto, {
        include: [
            {
                model: usuario,
                attributes: ["nombre"]
            }
        ],
        where: params});
}

async function consultar_miembro(id){
    return await queries_generales.consultar(puesto, {
        include: [
            {
                model: usuario,
                attributes: ["nombre"]
            }
        ],
        where: {
            id
        }});
}

async function consultar_puestos_usuario(id_usuario){
    return await queries_generales.consultar(puesto, {
        where: {
            id_usuario
        }
    });
}

async function consultar_permisos(id_usuario, id_organizacion, permiso){
    const puestos = await consultar_puestos_usuario(id_usuario);
    var puesto = {};
    for(var i = 0; i < puestos.length; i+=1){
        puesto = puestos[i];
        if(puesto[permiso] && puesto.id_organizacion === parseInt(id_organizacion)){
            return true;
        }
    }
    return false;
}

module.exports = {
    consultar_puestos_usuario,
    agregar_miembro,
    agregar_miembros,
    modificar_miembro,
    eliminar_miembro,
    consultar_miembros,
    consultar_miembro,
    consultar_permisos
}