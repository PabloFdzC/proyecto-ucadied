function moverDatosUsuario(persona, agregaFaltante){
    if(persona.usuario){
        let usuario = persona.usuario;
        persona.email = usuario.email;
        persona.tipo = usuario.tipo;
        persona.activo = usuario.activo;
        delete persona.usuario;
    } else if(agregaFaltante){
        persona.email = "";
        persona.tipo = "";
        persona.activo = false;
    }
    return persona;
}

function moverDatosUsuarios(usuarios, agregaFaltante){
    for(let i = 0; i < usuarios.length; i++){
        usuarios[i] = moverDatosUsuario(usuarios[i], agregaFaltante);
    }
    return usuarios;
}

function moverDatosPersona(usuario, agregaFaltante){
    if(usuario.persona){
        let persona = usuario.persona;
        usuario.fecha_nacimiento = persona.fecha_nacimiento;
        usuario.nombre = persona.nombre;
        usuario.profesion = persona.profesion;
        usuario.nacionalidad = persona.nacionalidad;
        usuario.telefonos = persona.telefonos;
        usuario.sexo = persona.sexo;
        delete usuario.persona;
    } else if(agregaFaltante){
        usuario.fecha_nacimiento = "";
        usuario.nombre = "";
        usuario.profesion = "";
        usuario.nacionalidad = "";
        usuario.telefonos = "";
        usuario.sexo = "";
    }
    return usuario;
}

function moverDatosPersonas(usuarios,agregaFaltante){
    for(let i = 0; i < usuarios.length; i++){
        usuarios[i] = moverDatosPersona(usuarios[i],agregaFaltante);
    }
    return usuarios;
}

export default {
    moverDatosPersona,
    moverDatosPersonas,
    moverDatosUsuarios,
    moverDatosUsuario,
};