const bcrypt = require('bcrypt');
const { Op } = require("sequelize");
const usuario = require('../modelo/usuario');
const persona = require('../modelo/persona');
const queries_generales = require('./QueriesGenerales');
const personaCtrl = require('./PersonaControlador');

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
    const persona_creada = await personaCtrl.crear(info);
    const contrasenna = creadorContrasenna();
    const usuario_info = {
        email: info.email,
        contrasenna: bcrypt.hashSync(contrasenna, 10),
        tipo: info.tipo,
        activo: true,
        id_persona: persona_creada.id
    }
    const usuario_creado = await queries_generales.crear(usuario, usuario_info);
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
    if(params.id_usuario){
        const info_usuario = await queries_generales.consultar(usuario, {
            attributes: {exclude: ['contrasenna']},
            include: [{model: persona}],
            where: {
                id: params.id_usuario
            }});
        return info_usuario;
    }
    else{
        const usuarios = await queries_generales.consultar(usuario, {
            include: [{model: persona}]});
        return usuarios;
    }
}

async function consultarTipo(esAdmin){
    if(esAdmin === '1'){
        return await queries_generales.consultar(usuario, {
            include: [{model: persona}],
            where: {
                tipo: "Administrador"
            }});
    }
    else{
        return await queries_generales.consultar(persona, {
            include: [{
                model: usuario,
                where: {
                    [Op.or]:[{tipo: "Usuario"}]
                },
                required:false
            }],
            where:{
                id_organizacion:{[Op.ne]:null}
            }
            });
    }
}

async function iniciarSesion(info){
    var usuario_info = await queries_generales.consultar(usuario, {where: 
    {
        email: info.email
    }});
    if(usuario_info.length === 1){
        usuario_info = usuario_info[0];
        const match = await bcrypt.compare(info.contrasenna, usuario_info.contrasenna);
        if(match){
            return {
                id_usuario: usuario_info.id,
                tipo: usuario_info.tipo,
                usuario_info:usuario_info,
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
        return await queries_generales.modificar(usuario, id, info);
    }
    else{
        const info_usuario = await consultar({id_usuario: id});
        await personaCtrl.modificar(info_usuario.id_persona, info);
        return await queries_generales.modificar(usuario, id, info);
    }
}

async function eliminar(id){
    const info_usuario = await consultar({id_usuario: id});
    if(info_usuario.length === 1){
        await personaCtrl.eliminar(info_usuario[0].id_persona);
        return await queries_generales.eliminar(usuario, {id});
    }
    else{
        return {error: "No se pudo eliminar el usuario"}
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