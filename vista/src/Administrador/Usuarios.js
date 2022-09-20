import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import UsuarioForm from '../Usuario/UsuarioForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import moverDatosPersonas from '../Usuario/moverDatosPersona';

import Tabla from '../Utilidades/Tabla.js'
import moverDatosUsuarios from '../Usuario/moverDatosUsuario';

class Usuarios extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            usuarios: []
        }
        this.titulos = [
            {llave:"nombre",valor:"Nombre"},
            {llave:"sexo",valor:"Sexo"},
            {llave:"email",valor:"Email"},
            {llave:"fecha_nacimiento",valor:"Fecha de nacimiento"},
            {llave:"profesion",valor:"Profesión"},
            {llave:"nacionalidad",valor:"Nacionalidad"},
            {llave:"telefonos",valor:"Teléfonos"},
        ];
        this.avisaCreado = this.avisaCreado.bind(this);
    }
    
    async cargarUsuarios(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultarTipo/0", {});
            var usuarios = moverDatosUsuarios(resp.data);
            console.log(resp);
            this.setState({
                usuarios:this.state.usuarios.concat(usuarios),
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

    async avisaCreado(){
        await this.cargarUsuarios();
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Usuarios</h1>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="lni lni-plus"></i>  Agregar usuario</button>
                                </div>
                                <div className="row" style={{height:"inherit"}}>
                                    <div style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                        <Tabla titulos={this.titulos} datos={this.state.usuarios} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="modalAgregarUnion" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                        <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                            <div className="modal-body">
                                                <UsuarioForm administrador={false} titulo={"Agregar Usuario"} ocupaAsociacion={true} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
                } else {
                    return (<Navigate to='/iniciarSesion' replace={true}/>);
                }
            }}
        </usuarioContexto.Consumer>);
    }
}

export default Usuarios;