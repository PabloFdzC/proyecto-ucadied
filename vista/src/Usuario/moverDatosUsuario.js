function moverDatosUsuario(persona){
    let usuario = persona.usuario;
    persona.email = usuario.email;
    persona.tipo = usuario.tipo;
    persona.activo = usuario.activo;
    delete persona.usuario;
    return persona;
}

function moverDatosUsuarios(usuarios){
    for(let i = 0; i < usuarios.length; i++){
        if(usuarios[i].usuario){
            usuarios[i] = moverDatosUsuario(usuarios[i]);
        } else {
            usuarios[i].email = "";
            usuarios[i].tipo = "";
            usuarios[i].activo = false;
            delete usuarios[i].usuario;
        }
    }
    return usuarios;
}

export default moverDatosUsuarios;