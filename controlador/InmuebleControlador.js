const inmueble = require('../modelo/inmueble');
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const reserva_inmueble = require('../modelo/reserva_inmueble');
const queries_generales = require('./QueriesGenerales');


async function consultar(params){
    if(params.id_inmueble){
        return await queries_generales.consultar(inmueble, {where: {
            id: params.id_inmueble
        }});
    }
    else{
        return await queries_generales.consultar(inmueble, {});
    }
}

async function consultar_reservas(params){
    if(params.id_reserva_inmueble){
        return await queries_generales.consultar(reserva_inmueble, {where: {
            id: params.id_reserva_inmueble
        }});
    }
    else if(params.id_inmueble){
        return await queries_generales.consultar(reserva_inmueble, {where: {
            id_inmueble: params.id_inmueble
        }});
    }
    else{
        return await queries_generales.consultar(reserva_inmueble, {});
    }
}

async function consultar_reservas_mes_anio(mes, anio){
    return await queries_generales.consultar(reserva_inmueble, {where: {
        [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('inicio')), parseInt(mes)),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('inicio')), parseInt(anio)),
            Sequelize.where(Sequelize.col('habilitado'), 1)
        ],
    }});
}

async function consultar_reserva_fecha(fecha, id_inmueble){
    return await queries_generales.consultar(reserva_inmueble, {where: {
        inicio: {
            [Op.gte]: fecha.setUTCHours(0, 0, 0, 0),
            [Op.lte]: fecha.setUTCHours(23, 59, 59)
        },
        id_inmueble,
        habilitado: '1'
    }});
}

async function crear(info){
    return await queries_generales.crear(inmueble, info);
}

async function crear_reserva(info){
    return await queries_generales.crear(reserva_inmueble, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(inmueble, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(inmueble, {id});
}

async function eliminar_reserva(id){
    return await queries_generales.eliminar(reserva_inmueble, {id});
}

async function habilitar_reserva(id){
    return await queries_generales.modificar(reserva_inmueble, id, {habilitado: '1'})
}


module.exports = {
    consultar,
    consultar_reserva_fecha,
    consultar_reservas,
    consultar_reservas_mes_anio,
    crear,
    crear_reserva,
    modificar,
    eliminar,
    eliminar_reserva, 
    habilitar_reserva
}