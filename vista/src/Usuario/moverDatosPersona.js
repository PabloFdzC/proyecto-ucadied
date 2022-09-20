function moverDatosPersona(usuario){
    let persona = usuario.persona;
    usuario.fecha_nacimiento = persona.fecha_nacimiento;
    usuario.nombre = persona.nombre;
    usuario.profesion = persona.profesion;
    usuario.nacionalidad = persona.nacionalidad;
    usuario.telefonos = persona.telefonos;
    usuario.sexo = persona.sexo;
    delete usuario.persona;
    return usuario;
}

function moverDatosPersonas(usuarios){
    for(let i = 0; i < usuarios.length; i++){
        usuarios[i] = moverDatosPersona(usuarios[i]);
    }
    return usuarios;
}

export default moverDatosPersonas;