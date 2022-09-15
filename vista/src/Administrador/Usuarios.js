import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import UsuarioForm from '../Usuario/UsuarioForm';

import Tabla from '../Utilidades/Tabla.js'

class Usuarios extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            usuarios: []
        }
        this.titulos = [
            {llave:"email",valor:"Email"},
            {llave:"tipo",valor:"Tipo"},
        ];
    }
    // Hay que hacer que se puedan consultar solo los usuarios que pertenezcan a una unión
    async cargarUsuarios(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultar", {});
            this.setState({
                usuarios:this.state.usuarios.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.usuariosPedidos){
            this.usuariosPedidos = true;
            this.cargarUsuarios();
        }
    }

    render(){
        return (
            <div>
                <div className="row align-items-center justify-content-between m-3">
                    <div className="col-8">
                        <h1>Usuarios</h1>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary"><i className="lni lni-plus"></i>  Agregar usuario</button>
                    </div>
                </div>
                <div className="row m-0">
                <Tabla titulos={this.titulos} datos={this.state.usuarios} />
                </div>
                <div className="row m-0">
                    <div className="container p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                    <div className="row">
                        <h2 className="text-center">Agregar Usuario</h2>
                    </div>
                    <div className="container">
                    <UsuarioForm administrador={false} />
                    </div>
                </div>
                </div>
            </div>
        );
    }
}

export default Usuarios;