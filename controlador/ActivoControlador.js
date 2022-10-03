const activo = require('../modelo/activo');
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const reserva_activo = require('../modelo/reserva_activo');
const queries_generales = require('./QueriesGenerales');


async function consultar(params){
    if(params.id_activo){
        return await queries_generales.consultar(activo, {where: {
            id: params.id_activo
        }});
    }
    else{
        return await queries_generales.consultar(activo, {});
    }
}

async function consultar_reservas(params){
    if(params.id_reserva_activo){
        return await queries_generales.consultar(reserva_activo, {where: {
            id: params.id_reserva_activo
        }});
    }
    else if(params.id_activo){
        return await queries_generales.consultar(reserva_activo, {where: {
            id_activo: params.id_activo
        }});
    }
    else{
        return await queries_generales.consultar(reserva_activo, {});
    }
}

async function consultar_reservas_mes_anio(mes, anio){
    return await queries_generales.consultar(reserva_activo, {where: {
        [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('inicio')), parseInt(mes)),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('inicio')), parseInt(anio)),
            Sequelize.where(Sequelize.col('habilitado'), 1)
        ],
    }});
}

async function consultar_reserva_fecha(fecha, id_activo){
    return await queries_generales.consultar(reserva_activo, {where: {
        inicio: {
            [Op.gte]: fecha.setUTCHours(0, 0, 0, 0),
            [Op.lte]: fecha.setUTCHours(23, 59, 59)
        },
        id_activo,
        habilitado: '1'
    }});
}

async function crear(info){
    return await queries_generales.crear(activo, info);
}

async function crear_reserva(info){
    return await queries_generales.crear(reserva_activo, info);
}

async function modificar(id, info){
    return await queries_generales.modificar(activo, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(activo, {id});
}

async function eliminar_reserva(id){
    return await queries_generales.eliminar(reserva_activo, {id});
}

async function habilitar_reserva(id){
    return await queries_generales.modificar(reserva_activo, id, {habilitado: '1'})
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