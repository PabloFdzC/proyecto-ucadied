const activo = require('../modelo/activo');
const queries_generales = require('./QueriesGenerales');

function consultar(params){
    if(params.id_activo){
        queries_generales.consultar(activo, {where: {
            id: params.id_activo
        }});
    }
    else{
        queries_generales.consultar(activo, {});
    }
}

function crear(info){
    return queries_generales.crear(activo, info);
}

function modificar(id, info){
    return queries_generales.modificar(activo, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(activo, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}