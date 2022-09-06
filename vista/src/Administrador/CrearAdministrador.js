import React from 'react';
import UsuarioForm from '../Usuario/UsuarioForm';

class CrearAdminstrador extends React.Component {
    constructor(props){
        super(props);
        this.titulos = props.titulos;
        this.datos = props.datos;
    }

    render(){
        return (
            <UsuarioForm administrador={true} />
        );
    }
}

export default CrearAdminstrador;