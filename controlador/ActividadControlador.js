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
            let [horaI, minI] = horario[i].inicio.split(":");
            let [horaF, minF] = horario[i].final.split(":");
            if(((inicio.getHours() >= horaI) || (inicio.getHours() === horaI && inicio.getMinutes() >= minI))
             && ((final.getHours() <= horaF) || (final.getHours() === horaF && final.getMinutes() <= minF))){
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
        if(((inicio.getHours() < final_reservas.getHours()) || (inicio.getHours() === final_reservas.getHours() && inicio.getMinutes() < final_reservas.getMinutes())) 
        && ((final.getHours() >= inicio_reservas.getHours()) || (final.getHours() === inicio_reservas.getHours() && final.getMinutes() >= inicio_reservas.getMinutes()))){
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
    if(info.id_inmueble){
        const inmuebles =  await inmuebleCtlr.consultar({id: info.id_inmueble});
        if(inmuebles.length === 1){
            const inmueble = inmuebles[0];
            const horario = inmueble.horario;
            if(info.dias){
                const dias = info.dias;
                const errores = await buscar_disponibilidad_dias(dias, horario, info.id_inmueble);
                if(errores.length === 0){
                    if(id_usuario && id_usuario != -1){
                        info.habilitado = true;
                    }
                    const actividad_creada = await queries_generales.crear(actividad, info);
                    for(var i = 0; i < dias.length; i+=1){
                        let inicio = new Date(dias[i].inicio);
                        let final = new Date(dias[i].final);
                        let habilitado = 0;
                        if(info.habilitado){
                            habilitado = info.habilitado;
                        }
                        await inmuebleCtlr.crear_reserva({
                            inicio,
                            final,
                            habilitado,
                            id_actividad: actividad_creada.id,
                            id_inmueble: info.id_inmueble
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
            return {error: "inmueble no encontrado"};
        }
    }else{
        return {error: "inmueble no encontrado"};
    }
}

async function modificar(id, info){
    return await queries_generales.modificar(actividad, id, info)
}

async function eliminar(id){
    return await queries_generales.eliminar(actividad, {id});
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar,
}