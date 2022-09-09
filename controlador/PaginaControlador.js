const pagina = require('../modelo/pagina');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    if(params.id_pagina){
        return await queries_generales.consultar(pagina, {where: {
            id: params.id_pagina
        }});
    }
    else{
        return await queries_generales.consultar(pagina, {});
    }
}

async function crear(info){
    return await queries_generales.crear(pagina, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(pagina, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(pagina, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}