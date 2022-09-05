const bcrypt = require('bcrypt');
const usuario = require('../modelo/usuario');
const persona = require('../modelo/persona');
const queries_generales = require('./QueriesGenerales');
const personaCtrl = require('./PersonaControlador');

function crear(info){
    const persona_creada = personaCtrl.crear(info);
    const usuario_info = {
        email: info.email,
        contrasenna: bcrypt.hashSync(info.contrasenna, 10),
        tipo: info.tipo,
        activo: true,
        id_persona: persona_creada.id
    }
    return queries_generales.crear(usuario, usuario_info);
}

function consultar(params){
    if(params.id_usuario){
        const info_usuario = queries_generales.consultar(usuario, {
            include: [{model: persona}],
            where: {
                id: params.id_usuario
            }});
        return info_usuario;
    }
    else{
        const usuarios = queries_generales.consultar(usuario, {
            include: [{model: persona}]});
        return usuarios;
    }
}

function iniciarSesion(info){
    var usuario_info = queries_generales.consultar(usuario, {where: 
    {
        email: info.email
    }});
    if(usuario_info.length === 1){
        usuario_info = usuario_info[0];
        bcrypt.compare(info.contrasenna, usuario_info.contrasenna, (err, result) => {
            if(result){
                return({success: "Se inicia sesión correctamente"});
            }
            else{
                return({error: "Email o contraseña incorrectos"});
            }
        });
    }
    else{
        return({error: "Email o contraseña incorrectos"});
    }
}

function modificar(id, info){
    if(info.contrasenna){
        info.contrasenna = bcrypt.hashSync(info.contrasenna, 10);
        return queries_generales.modificar(usuario, id, info);
    }
    else{
        const info_usuario = consultar({id_usuario: id});
        personaCtrl.modificar(info_usuario.id_persona, info);
        return queries_generales.modificar(usuario, id, info);
    }
}

function eliminar(id){
    const info_usuario = consultar({id_usuario: id});
    personaCtrl.eliminar(info_usuario.id_persona);
    return queries_generales.eliminar(usuario, id);
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar,
    iniciarSesion
}