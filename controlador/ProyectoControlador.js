const proyecto = require('../modelo/proyecto');
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');

async function consultar(params){
    return await queries_generales.consultar(proyecto,
        {
            where: params,
            include: {
                model: usuario,
                attributes:["id","nombre"]
            }
        });
}

async function crear(info){
    return await queries_generales.crear(proyecto, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(proyecto, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(proyecto, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}