const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');
const organizacionCtrl = require('./OrganizacionControlador');
const puestoCtlr = require('./PuestoControlador');
const correoCtlr = require('./CorreoControlador');
const {CODIGO_STATUS_HTTP} = require('./respuestas');
const { verificarEncontrado } = require('./verificaErrores');

// Esta función se encarga de crear una contraseña aleatoria de 16 dígitos
// a través de letras mayúsculas y mínúsculas y números.
function creadorContrasenna(){
    const caracteres = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    var valor_random = Math.floor(Math.random() * 52);
    var contrasenna = "";
    contrasenna += caracteres[valor_random];
    for(i = 1; i <= 15; i+=1){
        valor_random = Math.floor(Math.random() * 62);
        contrasenna += caracteres[valor_random];
    }
    return contrasenna;
}

// Crea un usuario con una contraseña aleatoria
// recibe un parámetro el cual debe ser un diccionario
// con la información del usuario. Después de crear
// el usuario, le manda un email con sus datos de 
// inicio de sesión.
async function crear(info){
    try{
        const contrasenna = creadorContrasenna();
        info.contrasenna = bcrypt.hashSync(contrasenna, 10);
        const usuario_creado = await queries_generales.crear(usuario, info);
        var puesto_creado = null;
        if(info.puesto && info.puesto != ""){
            puesto_creado = await puestoCtlr.crear({
                nombre:info.puesto,
                id_usuario: usuario_creado.id,
                id_organizacion: info.id_organizacion,
                edita_pagina: info.edita_pagina,
                edita_junta: info.edita_junta,
                edita_proyecto: info.edita_proyecto,
                edita_actividad: info.edita_actividad,
                edita_inmueble: info.edita_inmueble,
            })
        }
        await correoCtlr.enviarCorreo(`
                <div>
                <span>Acaba de registrarse correctamente en el sistema de UCADIED, sus datos de inicio de sesión son los siguientes:</span>
                </div>
                <div>
                    <p>Correo:${info.email}<p>
                    <p>Contraseña:${contrasenna}<p>
                </div>
                <p>Este es un mensaje automatizado, favor no responder a esta dirección.<p>
                `,
                'Su correo y contraseña en el sistema UCADIED',
                info.email);
        return {
            usuario_creado,
            puesto_creado,
            contrasenna
        };
    }catch(err){
        if (err.name === 'SequelizeUniqueConstraintError') {
            throw {
                errorConocido: true,
                status:CODIGO_STATUS_HTTP.ERROR_USUARIO,
                error: "Ya existe un usuario con ese correo"
            };
        }
        else{
            throw err;
        }
    }
}

// Esta función revisa si ya existe
// algún administrador en el sistema.
async function existeAdministrador(){
    const usuarios = await queries_generales.consultar(usuario, {
        where: {
            tipo: "Administrador"
        }});
    return usuarios.length > 0;
}

// Consulta una lista de usuarios
// tiene un parámetro en el cual
// se indican los parámetros de 
// búsqueda.
async function consultar(params){
    const info_usuario = await queries_generales.consultar(usuario, {
        attributes: {exclude: ['contrasenna']},
        where: params});

    verificarEncontrado(info_usuario, "No se pudo encontrar los usuarios");

    return info_usuario;
}

// Consulta usuarios de un tipo, si se
// manda un true como parámetro, devuelve
// administradores, si es false, devuelve
// usuarios normales.
async function consultarTipo(esAdmin){
    let resultados;
    if(esAdmin === '1'){
        resultados = await queries_generales.consultar(usuario, {
            where: {
                tipo: "Administrador"
            }});
    }
    else{
        resultados = await queries_generales.consultar(usuario, {
            where: {
                tipo: "Usuario"
            }});
    }

    verificarEncontrado(resultados, "No se pudo encontrar los usuarios");

    return resultados;
}

// Función para iniciar sesión en el sistema.
// Recibe un parámetro donde debe venir el email
// y la contraseña del usuario. Devuelve los datos
// del usuario.
async function iniciarSesion(info){
    var usuario_info = await queries_generales.consultar(usuario,
        {where: {
            email: info.email
        },
    });
    if(usuario_info.length === 1){
        usuario_info = usuario_info[0];
        const match = await bcrypt.compare(info.contrasenna, usuario_info.contrasenna);
        if(match){
            var organizacion = {};
            var puestos = [];
            if(usuario_info.tipo === "Usuario"){
                puestos = await puestoCtlr.consultar_puestos_usuario(usuario_info.id);
                organizacion = await organizacionCtrl.consultar({id:usuario_info.id_organizacion});
                organizacion = organizacion[0];
            }
            return {
                id_usuario: usuario_info.id,
                tipo: usuario_info.tipo,
                id_organizacion:usuario_info.id_organizacion,
                organizacion,
                puestos,
                success: "Se inicia sesión correctamente"
            };
        }
        else{
            throw {error: "Email o contraseña incorrectos",status:CODIGO_STATUS_HTTP.ERROR_USUARIO, errorConocido:true};
        }
    }
    else{
        throw {error: "Email o contraseña incorrectos", status:CODIGO_STATUS_HTTP.ERROR_USUARIO, errorConocido:true};
    }
}

// Modifica un usuario, recible el id
// del usuario y los datos a modificar.
async function modificar(id, info){
    if(info.contrasenna){
        info.contrasenna = bcrypt.hashSync(info.contrasenna, 10);
    }
    return await queries_generales.modificar(usuario, {id}, info);
}

// Elimina un usuario, recibe el id
// del usuario a eliminar.
async function eliminar(id){
    const info_usuario = await consultar({id});
    if(info_usuario.length === 1){
        return await queries_generales.eliminar(usuario, {id});
    }
    else{
        throw {error: "El usuario no existe."};
    }
}

async function restablecerContrasenna(info){
    if(info.email && (typeof info.email) === "string"){
        const usuario = await consultar({email:info.email});
        const contrasenna = creadorContrasenna();
        const resp = await modificar(usuario[0].id, {contrasenna});
        await correoCtlr.enviarCorreo(`
        <div>
        <span>La nueva contraseña es:</span>
        </div>
        <div>
            ${contrasenna}
        </div>
        <p>Este es un mensaje automatizado, favor no responder a esta dirección.<p>
        `,
        'Restablecer contraseña en el sistema UCADIED',
        info.email);
        return resp;
    }
}

module.exports = {
    existeAdministrador,
    consultar,
    consultarTipo,
    crear,
    modificar,
    eliminar,
    iniciarSesion,
    restablecerContrasenna,
}