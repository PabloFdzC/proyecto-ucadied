import React from 'react';
import UsuarioForm from '../Usuario/UsuarioForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Tabla.js'
import QueriesGenerales from "../QueriesGenerales";

class Administradores extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            administradores: []
        }
        this.administradoresPedidos = false;
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
    // Hay que hacer que se puedan pedir solo administradores con información importante
    async cargarAdministradores(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultarTipo/1", {});
            this.setState({
                administradores:this.state.administradores.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    async avisaCreado(usuario){
        var administradores = this.state.administradores;
        this.setState({
            administradores:administradores.concat(usuario),
        });
    }

    componentDidMount() {
        if(!this.administradoresPedidos){
            this.administradoresPedidos = true;
            this.cargarAdministradores();
        }
    }

    render(){
        // return (
        //     <usuarioContexto.Consumer >
        //         {({usuario})=>{
        //             if(usuario.tipo === "Administrador"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Administradores</h1>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="lni lni-plus"></i>  Agregar administrador</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                        <Tabla titulos={this.titulos} datos={this.state.administradores} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="modalAgregarAdministrador" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                        <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                            <div className="modal-body">
                                                <UsuarioForm administrador={true} titulo={"Agregar Administrador"} avisaCreado={this.avisaCreado} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        );
            //         } else {
            //             return (<Navigate to='/iniciarSesion' replace={true}/>);
            //         }
            //     }}
            // </usuarioContexto.Consumer>
            
        //);
    }
}

export default Administradores;