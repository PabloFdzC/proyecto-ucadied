const organizacion = require('../modelo/organizacion');

function consultar(params){
    if(params.id_organizacion){
        queries_generales.consultar(organizacion, {where: {
            id: req.params.id_organizacion
        }});
    }
    else{
        queries_generales.consultar(organizacion, {});
    }
}

function crear(info){
    return queries_generales.crear(organizacion, info);
}

function modificar(id, info){
    return queries_generales.modificar(organizacion, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(organizacion, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}