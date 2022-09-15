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
            {llave:"email",valor:"Email"},
            {llave:"tipo",valor:"Tipo"},
        ];
    }
    // Hay que hacer que se puedan pedir solo administradores con información importante
    async cargarAdministradores(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultar", {});
            this.setState({
                administradores:this.state.administradores.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
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
                            <div>
                                <div className="container-fluid">
                                    <div className="row align-items-center justify-content-between m-3">
                                        <div className="col-8">
                                            <h1>Administradores</h1>
                                        </div>
                                        <div className="col-3">
                                            <button className="btn btn-primary"><i className="lni lni-plus"></i>  Agregar administrador</button>
                                        </div>
                                    </div>
                                    <div className="row">
                                        <Tabla titulos={this.titulos} datos={this.state.administradores} />
                                    </div>
                                </div>
                                <div className="row" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="row">
                                        <h2 className="text-center">Agregar administrador</h2>
                                    </div>
                                    <div className="row">
                                        <UsuarioForm administrador={true} />
                                    </div>
                                </div>
                            </div>
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