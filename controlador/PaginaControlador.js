const pagina = require('../modelo/pagina');
const queries_generales = require('./QueriesGenerales');

function consultar(params){
    if(params.id_pagina){
        queries_generales.consultar(pagina, {where: {
            id: params.id_pagina
        }});
    }
    else{
        queries_generales.consultar(pagina, {});
    }
}

function crear(info){
    return queries_generales.crear(pagina, info);
}

function modificar(id, info){
    return queries_generales.modificar(pagina, id, info)
}

function eliminar(id){
    return queries_generales.eliminar(pagina, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}