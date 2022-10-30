const actividad = require('../modelo/actividad');
const queries_generales = require('./QueriesGenerales');
const inmuebleCtlr = require('./InmuebleControlador');
const usuarioCtrl = require('.//UsuarioControlador');
const reserva_inmueble = require('../modelo/reserva_inmueble');
const { Op } = require("sequelize");
const Sequelize = require("sequelize");
const inmueble = require('../modelo/inmueble');

async function consultar(paramsActividad, paramsReserva, paramsInmueble, id_usuario){
    var resp = [];
    var mesDiaAnio = [];
    if(paramsReserva.dia){
        mesDiaAnio.push(Sequelize.where(Sequelize.fn('DAY', Sequelize.col('reserva_inmuebles.inicio')), parseInt(paramsReserva.dia)));
        delete paramsReserva.dia;
    }
    if(paramsReserva.mes){
        mesDiaAnio.push(Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('reserva_inmuebles.inicio')), parseInt(paramsReserva.mes)));
        delete paramsReserva.mes;
    }
    if(paramsReserva.anio){
        mesDiaAnio.push(Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('reserva_inmuebles.inicio')), parseInt(paramsReserva.anio)));
        delete paramsReserva.anio;
    }
    if(mesDiaAnio.length > 0){
        paramsReserva[Op.and] = mesDiaAnio;
    }
    if(!id_usuario || id_usuario === -1){
        if(paramsActividad.tipo == "Privada"){
            return await queries_generales.consultar(actividad, {
                include:[
                    {
                        model: inmueble,
                        required: true,
                        where: paramsInmueble,
                        attributes:["id","nombre","horario",]
                    },
                    {
                        model: reserva_inmueble,
                        required: true,
                        where: paramsReserva,
                    }
                ],
                attributes:{exclude:["coordinador","telefonos","email"]},
                where: paramsActividad
            });
        } else if(!paramsActividad.tipo || paramsActividad.tipo == ""){
            paramsActividad.tipo = "Privada";
            resp = await queries_generales.consultar(actividad, {
                include:[
                    {
                        model: inmueble,
                        required: true,
                        where: paramsInmueble,
                        attributes:["id","nombre","horario",]
                    },
                    {
                        model: reserva_inmueble,
                        required: true,
                        where: paramsReserva,
                    }
                ],
                attributes:{exclude:["coordinador","telefonos","email"]},
                where: paramsActividad
            });
            paramsActividad.tipo = "Pública";
        }
    } 
    var resp2 = await queries_generales.consultar(actividad, {
        include:[
            {
                model: inmueble,
                required: true,
                where: paramsInmueble,
                attributes:["id","nombre","horario",],
            },
            {
                model: reserva_inmueble,
                required: true,
                where: paramsReserva,
            }
        ],
        where: paramsActividad
    });

    return resp.concat(resp2);
}

async function buscar_disponibilidad_horario(inicio, final, horario){
    const dias_semana = ['D', 'L', 'K', 'M', 'J', 'V', 'S'];
    const dia = dias_semana[inicio.getDay()];
    var dia_horario;
    for(var i = 0; i < horario.length; i+=1){
        dia_horario = horario[i].dia;
        if(dia_horario === dia){
            let inicio_horario = new Date(horario[i].inicio);
            let final_horario = new Date(horario[i].final);
            if(((inicio.getUTCHours() > inicio_horario.getUTCHours()) ||(inicio.getUTCHours() === inicio_horario.getUTCHours() && inicio.getUTCMinutes() >= inicio_horario.getUTCMinutes()))
             && ((final.getUTCHours() < final_horario.getUTCHours()) || (final.getUTCHours() === final_horario.getUTCHours() && final.getUTCMinutes() <= final_horario.getUTCMinutes()))){
                return true;
            }
        }
    }
    return false;
}

async function buscar_disponibilidad_reservas(inicio, final, id_inmueble){
    const reservas =  await inmuebleCtlr.consultar_reserva_fecha(inicio, id_inmueble);
    var inicio_reservas;
    var final_reservas;
    for(var i = 0; i < reservas.length; i+=1){
        inicio_reservas = new Date(reservas[i].inicio);
        final_reservas = new Date(reservas[i].final);
        if((inicio_reservas.getUTCHours() <= inicio.getUTCHours() && final_reservas.getUTCHours() >= final.getUTCHours()) ||
        (final_reservas.getUTCHours() == inicio.getUTCHours() && final_reservas.getUTCMinutes() > inicio.getUTCMinutes()) ||
        (inicio_reservas.getUTCHours() > inicio.getUTCHours() && inicio_reservas.getUTCHours() < final.getUTCHours()) ||
        (final_reservas.getUTCHours() > inicio.getUTCHours() && final_reservas.getUTCHours() < final.getUTCHours()) ||
        (inicio_reservas.getUTCHours() == final.getUTCHours() && inicio_reservas.getUTCMinutes() < final.getUTCMinutes())){
            return false;
        }
    }
    return true;
}

async function buscar_disponibilidad_dias(dias, horario, id_inmueble){
    var inicio = new Date();
    var final = new Date();
    var errores = [];
    for(var i = 0; i < dias.length; i+=1){
        inicio = new Date(dias[i].inicio);
        final = new Date(dias[i].final);
        if(await buscar_disponibilidad_horario(inicio, final, horario)){
            if(await !buscar_disponibilidad_reservas(inicio, final, id_inmueble)){
                errores = errores.concat([{
                    inicio:inicio.toUTCString(),
                    final:final.toUTCString()
                }]);
            }
        }
        else{
            errores = errores.concat([{
                inicio:inicio.toUTCString(),
                final:final.toUTCString()
            }]);
        }
    }
    return errores;
}

async function crear_habilitar(info, id_usuario, habilitar){
    if(info.id_inmueble){
        const inmuebles =  await inmuebleCtlr.consultar({id: info.id_inmueble});
        if(inmuebles.length === 1){
            const inmueble = inmuebles[0];
            const horario = inmueble.horario;
            if(info.dias){
                const errores = await buscar_disponibilidad_dias(info.dias, horario, info.id_inmueble);
                if(errores.length === 0){
                    info.habilitado = id_usuario && id_usuario != -1;
                    if(habilitar)
                        return cambiaHabilitado(info);
                    else
                        return crear(info);
                }
                else{
                    return {errores};
                }
            }
            else{
                return{error: "Información de días no enviada"}
            }
        }
        else{
            return {error: "inmueble no encontrado"};
        }
    }else{
        return {error: "inmueble no encontrado"};
    }
}

async function cambiaHabilitado(info){
    var listaHabilitar = [];
    for(let dia of info.dias){
        listaHabilitar.push({id: dia.id});
    }
    return await queries_generales.modificar(reserva_inmueble, {[Op.or]: listaHabilitar}, {habilitado:info.habilitado});
}

async function crear(info){
    const actividad_creada = await queries_generales.crear(actividad, info);
    var reservas = [];
    for(var i = 0; i < info.dias.length; i+=1){
        let inicio = new Date(info.dias[i].inicio);
        let final = new Date(info.dias[i].final);
        reservas.push({
            inicio,
            final,
            habilitado: info.habilitado ? info.habilitado : false,
            id_actividad: actividad_creada.id,
            id_inmueble: info.id_inmueble
        });
    }
    await inmuebleCtlr.crear_reservas(reservas);
}

async function modificar(id, info){
    return await queries_generales.modificar(actividad, {id}, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(actividad, {id});
}

async function eliminarReservasInhabilitadas(id_actividad){
    const resp = await queries_generales.eliminar(reserva_inmueble, {
        id_actividad,
        habilitado: false,
    });
    eliminarActividadSinReservas(id_actividad);
    return resp;
}

async function eliminarReserva(id){
    const resp = await queries_generales.consultar(reserva_inmueble, {id});
    const elimina = await queries_generales.eliminar(reserva_inmueble, {id});
    eliminarActividadSinReservas(resp[0].id_actividad);
    return elimina;
}

async function eliminarActividadSinReservas(id_actividad){
    const resp = await queries_generales.consultar(reserva_inmueble,{id_actividad:id_actividad});
    if(resp.length === 0){
        await eliminar(id_actividad);
    }
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar,
    crear_habilitar,
    cambiaHabilitado,
    eliminarReservasInhabilitadas,
    eliminarReserva,
}