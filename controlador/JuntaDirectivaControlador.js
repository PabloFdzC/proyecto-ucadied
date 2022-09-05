const junta_directiva = require('../modelo/junta_directiva');
const queries_generales = require('./QueriesGenerales');

function consultar(params){
    if(params.id_junta_directiva){
        queries_generales.consultar(junta_directiva, {where: {
            id: params.id_junta_directiva
        }});
    }
    else{
        queries_generales.consultar(junta_directiva, {});
    }
}

function crear(info){
    return queries_generales.crear(junta_directiva, info);
}

function modificar(id, info){
    return queries_generales.modificar(junta_directiva, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(junta_directiva, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}