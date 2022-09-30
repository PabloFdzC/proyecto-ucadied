const actividad = require('../modelo/actividad');
const queries_generales = require('./QueriesGenerales');
const activoCtlr = require('./ActivoControlador');
const usuarioCtrl = require('.//UsuarioControlador');
const reserva_activo = require('../modelo/reserva_activo');
const { Op } = require("sequelize");
const Sequelize = require("sequelize");

async function consultar(params){
    if(params.id_actividad){
        return await queries_generales.consultar(actividad, {
            include: {
                model: reserva_activo,
                required: true
            },
            where: {
                id: params.id_actividad
            }
        });
    }
    else{
        return await queries_generales.consultar(actividad, {include: reserva_activo});
    }
}

async function buscar_disponibilidad_horario(inicio, final, horario){
    const dias_semana = ['D', 'L', 'K', 'M', 'J', 'V', 'S'];
    const dia = dias_semana[inicio.getDay()];
    var dia_horario;
    var inicio_horario;
    var final_horario;
    for(var i = 0; i < horario.length; i+=1){
        dia_horario = horario[i].dia;
        if(dia_horario === dia){
            inicio_horario = new Date(horario[i].inicio);
            final_horario = new Date(horario[i].final);
            if(((inicio.getUTCHours() >= inicio_horario.getUTCHours()) || (inicio.getUTCHours() === inicio_horario.getUTCHours() && inicio.getUTCMinutes() >= inicio_horario.getUTCMinutes()))
             && ((final.getUTCHours() <= final_horario.getUTCHours()) || (final.getUTCHours() === final_horario.getUTCHours() && final.getUTCMinutes() <= final_horario.getUTCMinutes()))){
                return true;
            }
        }
    }
    return false;
}

async function buscar_disponibilidad_reservas(inicio, final, id_activo){
    const reservas =  await activoCtlr.consultar_reserva_fecha(inicio, id_activo);
    var inicio_reservas;
    var final_reservas;
    for(var i = 0; i < reservas.length; i+=1){
        inicio_reservas = new Date(reservas[i].inicio);
        final_reservas = new Date(reservas[i].final);
        if(((inicio.getUTCHours() < final_reservas.getUTCHours()) || (inicio.getUTCHours() === final_reservas.getUTCHours() && inicio.getUTCMinutes() < final_reservas.getUTCMinutes())) 
        && ((final.getUTCHours() >= inicio_reservas.getUTCHours()) || (final.getUTCHours() === inicio_reservas.getUTCHours() && final.getUTCMinutes() >= inicio_reservas.getUTCMinutes()))){
            return false;
        }
    }
    return true;
}

async function buscar_disponibilidad_dias(dias, horario, id_activo){
    var inicio = new Date();
    var final = new Date();
    var errores = [];
    for(var i = 0; i < dias.length; i+=1){
        inicio = new Date(dias[i].inicio);
        final = new Date(dias[i].final);
        if(await buscar_disponibilidad_horario(inicio, final, horario)){
            console.log(inicio);
            if(await !buscar_disponibilidad_reservas(inicio, final, id_activo)){
                errores = errores.concat([{inicio, final}]);
            }
        }
        else{
            errores = errores.concat([{inicio, final}]);
        }
    }
    return errores;
}

async function crear(info, id_usuario){
    if(info.id_activo){
        const activos =  await activoCtlr.consultar({id_activo: info.id_activo});
        if(activos.length === 1){
            const activo = activos[0];
            const horario = activo.horario;
            if(activo.disponible){
                if(info.dias){
                    const dias = info.dias;
                    const errores = await buscar_disponibilidad_dias(dias, horario, info.id_activo);
                    if(errores.length === 0){
                        if(id_usuario && id_usuario != -1){
                            if(!info.coordinador || !info.email || !info.telefonos){
                                console.log(id_usuario)
                                var usuario_logeado = await usuarioCtrl.consultar({id: id_usuario});
                                usuario_logeado = usuario_logeado[0];
                                console.log(usuario_logeado)
                                if(!info.coordinador){
                                    info.coordinador = usuario_logeado.nombre;
                                }
                                if(!info.email){
                                    info.email = usuario_logeado.email;
                                }
                                if(!info.telefonos){
                                    info.telefonos = usuario_logeado.telefonos;
                                }
                            }
                        }
                        const actividad_creada = await queries_generales.crear(actividad, info);
                        var inicio = new Date();
                        var final = new Date();
                        for(var i = 0; i < dias.length; i+=1){
                            inicio = new Date(dias[i].inicio);
                            final = new Date(dias[i].final);
                            inicio = new Date(inicio.toUTCString());
                            final = new Date(final.toUTCString());
                            var habilitado = 0;
                            if(info.habilitado){
                                habilitado = info.habilitado;
                            }
                            await activoCtlr.crear_reserva({
                                inicio,
                                final,
                                habilitado,
                                id_actividad: actividad_creada.id,
                                id_activo: info.id_activo
                            });
                        }
                        return actividad_creada;
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
                return{error: "El activo no está disponible"}
            }
        }
        else{
            return {error: "Activo no encontrado"};
        }
    }else{
        return {error: "Activo no encontrado"};
    }
}

async function modificar(id, info){
    return await queries_generales.modificar(actividad, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(actividad, {id});
}

async function consultar_actividades_habilitadas(habilitado){
    return await queries_generales.consultar(actividad, {
        where: {
            '$reserva_activos.habilitado$': habilitado
        },
        include: {
            model: reserva_activo,
            required: true
        }
    });
}

async function consultar_actividades_dia(dia, mes, anio){
    const actividades = await queries_generales.consultar(actividad, {where: {
        [Op.and]: [
            Sequelize.where(Sequelize.fn('MONTH', Sequelize.col('reserva_activos.inicio')), parseInt(mes)),
            Sequelize.where(Sequelize.fn('YEAR', Sequelize.col('reserva_activos.inicio')), parseInt(anio)),
            Sequelize.where(Sequelize.fn('DAY', Sequelize.col('reserva_activos.inicio')), parseInt(dia)),
            Sequelize.where(Sequelize.col('reserva_activos.habilitado'), 1)
        ],
    },
    include: {
        model: reserva_activo,
        required: true
    }
    });
    for(var i = 0; i < actividades.length; i+=1){
        actividades[i].inicio = actividades.reserva_activos[0].inicio; 
        actividades[i].final = actividades.reserva_activos[0].final; 
    }
    return actividades;
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar,
    consultar_actividades_habilitadas,
    consultar_actividades_dia
}