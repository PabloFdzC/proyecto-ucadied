const actividad = require('../modelo/actividad');
const queries_generales = require('./QueriesGenerales');

function consultar(params){
    if(params.id_actividad){
        queries_generales.consultar(actividad, {where: {
            id: params.id_actividad
        }});
    }
    else{
        queries_generales.consultar(actividad, {});
    }
}

function crear(info){
    return queries_generales.crear(actividad, info);
}

function modificar(id, info){
    return queries_generales.modificar(actividad, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(actividad, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}