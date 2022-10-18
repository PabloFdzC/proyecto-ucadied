const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');
const organizacionCtrl = require('./OrganizacionControlador');
const JuntaDirectivaCtlr = require('./JuntaDirectivaControlador');


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

async function crear(info){
    const contrasenna = creadorContrasenna();
    info.contrasenna = bcrypt.hashSync(contrasenna, 10);
    var usuario_creado = await queries_generales.crear(usuario, info);
    if(info.puesto && info.puesto != ""){
        JuntaDirectivaCtlr.agregar_miembro({
            id_usuario: usuario_creado.id,
            id_puesto_jd: info.puesto,
            id_organizacion: info.id_organizacion,
        })
    }
    return {
        usuario_creado,
        contrasenna
    };
}

async function existeAdministrador(){
    const usuarios = await queries_generales.consultar(usuario, {
        where: {
            tipo: "Administrador"
        }});
    return usuarios.length > 0;
}

async function consultar(params){
    
    const info_usuario = await queries_generales.consultar(usuario, {
        attributes: {exclude: ['contrasenna']},
        where: params});
    return info_usuario;
}

async function consultarTipo(esAdmin){
    if(esAdmin === '1'){
        return await queries_generales.consultar(usuario, {
            where: {
                tipo: "Administrador"
            }});
    }
    else{
        return await queries_generales.consultar(usuario, {
            where: {
                tipo: "Usuario"
            }});
    }
}

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
            if(usuario_info.id_organizacion){
                organizacion = await organizacionCtrl.consultar({id_organizacion:usuario_info.id_organizacion});
                organizacion = organizacion[0];
            }
            if(usuario_info.tipo === "Usuario"){
                puestos = await JuntaDirectivaCtlr.consultar_puestos_usuario(usuario_info.id);
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
            return {error: "Email o contraseña incorrectos"};
        }
    }
    else{
        return {error: "Email o contraseña incorrectos"};
    }
}

async function modificar(id, info){
    if(info.contrasenna){
        info.contrasenna = bcrypt.hashSync(info.contrasenna, 10);
    }
    return await queries_generales.modificar(usuario, id, info);
}

async function eliminar(id){
    const info_usuario = await consultar({id_usuario: id});
    if(info_usuario.length === 1){
        return await queries_generales.eliminar(usuario, {id});
    }
    else{
        return {error: "El usuario no existe."}
    }
}

module.exports = {
    existeAdministrador,
    consultar,
    consultarTipo,
    crear,
    modificar,
    eliminar,
    iniciarSesion
}