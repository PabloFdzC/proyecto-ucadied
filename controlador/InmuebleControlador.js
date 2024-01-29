const inmueble = require('../modelo/inmueble');
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const reserva_inmueble = require('../modelo/reserva_inmueble');
const queries_generales = require('./QueriesGenerales');
const { verificarEncontrado } = require('./verificaErrores');

// Función para consultar un conjunto de inmuebles.
// Se debe enviar como parámetro los filtros de búsqueda.
async function consultar(params){
    const resultado = await queries_generales.consultar(inmueble, {where: params});
    
    verificarEncontrado(resultado, "No se encontró el inmueble");

    return resultado;
}

// Función para consultar un conjunto de reservas de inmuebles.
// Se debe enviar como parámetro los filtros de búsqueda.
async function consultar_reservas(params){
    let resultado;
    if(params.id_reserva_inmueble){
        resultado = await queries_generales.consultar(reserva_inmueble, {where: {
            id: params.id_reserva_inmueble
        }});
    }
    else if(params.id_inmueble){
        resultado = await queries_generales.consultar(reserva_inmueble, {where: {
            id_inmueble: params.id_inmueble
        }});
    }
    else{
        resultado = await queries_generales.consultar(reserva_inmueble, {});
    }

    verificarEncontrado(resultado, "No se encontraron las reservas");
    
    return resultado;

}

// Función para consultar un conjunto de reservas de inmuebles
// de un mes en específico. Se debe enviar como parámetro el
// mes y el año.
async function consultar_reservas_mes_anio(mes, anio){
    const resultado = await queries_generales.consultar(reserva_inmueble, {where: {
        [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('inicio')), parseInt(mes)),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('inicio')), parseInt(anio)),
            Sequelize.where(Sequelize.col('habilitado'), 1)
        ],
    }});

    verificarEncontrado(resultado, "No se encontraron las reservas");

    return resultado;
}

// Función para consultar las reservas de un inmueble un día 
// en específico. Se debe enviar como parámetro el id del inmueble
// y la fecha.
async function consultar_reserva_fecha(fecha, id_inmueble){
    const mayorQue = new Date(fecha);
    mayorQue.setUTCHours(0, 0, 0, 0);
    const menorQue = new Date(fecha);
    menorQue.setUTCHours(23, 59, 59);
    return await queries_generales.consultar(reserva_inmueble, {where: {
        inicio: {
            [Op.gte]: mayorQue,
            [Op.lte]: menorQue
        },
        id_inmueble,
        habilitado: '1'
    }});
}

// Función para crear un inmueble. Recibe como parámetro
// la información del inmueble.
async function crear(info){
    return await queries_generales.crear(inmueble, info);
}

// Función para crear varias reservas de un inmueble. Recibe 
// como parámetro la información de las reservas.
async function crear_reservas(info){
    return await queries_generales.crear_varios(reserva_inmueble, info);
}

// Función para modificar un inmueble. Recibe como parámetros
// el id del inmueble y la infomración que se desea modificar.
async function modificar(id, info){
    return await queries_generales.modificar(inmueble, {id}, info)
}

// Función para eliminar un inmueble. Recibe como parámetro
// el id del inmueble que se desea eliminar.
async function eliminar(id){
    return await queries_generales.eliminar(inmueble, {id});
}

// Función para eliminar una reserva. Recibe como parámetro
// el id de la reserva que se desea eliminar.
async function eliminar_reserva(id){
    return await queries_generales.eliminar(reserva_inmueble, {id})
}

// Función para habilitar una reserva. Recibe como parámetro
// el id de la reserva que se desea habilitar.
async function habilitar_reserva(id){
    return await queries_generales.modificar(reserva_inmueble, {id}, {habilitado: '1'})
}


module.exports = {
    consultar,
    consultar_reserva_fecha,
    consultar_reservas,
    consultar_reservas_mes_anio,
    crear,
    crear_reservas,
    modificar,
    eliminar,
    habilitar_reserva,
    eliminar_reserva
}