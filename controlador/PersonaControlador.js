const persona = require('../modelo/persona');
const queries_generales = require('./QueriesGenerales');

function consultar(params){
    if(params.id_persona){
        queries_generales.consultar(persona, {where: {
            id: params.id_persona
        }});
    }
    else{
        queries_generales.consultar(persona, {});
    }
}

function crear(info){
    return queries_generales.crear(persona, info);
}

function modificar(id, info){
    return queries_generales.modificar(persona, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(persona, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}