const proyecto = require('../modelo/proyecto');
const queries_generales = require('./QueriesGenerales');

function consultar(params){
    if(params.id_activo){
        queries_generales.consultar(proyecto, {where: {
            id: params.id_proyecto
        }});
    }
    else{
        queries_generales.consultar(proyecto, {});
    }
}

function crear(info){
    return queries_generales.crear(proyecto, info);
}

function modificar(id, info){
    return queries_generales.modificar(proyecto, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(proyecto, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}