const junta_directiva = require('../modelo/junta_directiva');
const puesto_jd = require('../modelo/puesto_jd');
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

async function consultar_puestos(id_junta){
    return await queries_generales.consultar(puesto_jd, {where: {
        id_junta_directiva: id_junta
    }});
}

async function crear(info){
    return await queries_generales.crear(junta_directiva, info);
}

async function crear_puesto(info){
    return await queries_generales.crear(puesto_jd, info);
}

async function modificar_puesto(id, info){
    return await queries_generales.modificar(puesto_jd, id, info)
}


async function modificar(id, info){
    return await queries_generales.modificar(junta_directiva, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(junta_directiva, id);
}

module.exports = {
    consultar,
    consultar_puestos,
    crear,
    crear_puesto,
    modificar_puesto,
    modificar,
    eliminar
}