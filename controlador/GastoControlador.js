const gasto = require('../modelo/gasto');
const queries_generales = require('./QueriesGenerales');
const { verificarEncontrado } = require('./verificaErrores');

// Función para consultar un conjunto de gastos.
// Recibe como parámetro los filtros de búsqueda.
async function consultar(params){
    const resultado = await queries_generales.consultar(gasto, {where:params});
    
    verificarEncontrado(resultado, "No se encontró el gasto");

    return resultado;
}

// Función para crear un gasto. Recibe como parámtero
// la información del gasto.
async function crear(info){
    return await queries_generales.crear(gasto, info);
}

// Función para modificar un gasto. Recibe como parámetros
// el id del gasto y la infomración que se desea modificar.
async function modificar(id, info){
    return await queries_generales.modificar(gasto, {id}, info)
}

// Función para eliminar un gasto. Recibe como parámetro
// el id del gasto que se desea eliminar.
async function eliminar(id){
    return await queries_generales.eliminar(gasto, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}