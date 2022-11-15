import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import ContrasennaForm from './ContrasennaForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Modal from 'react-bootstrap/Modal';


/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class Contrasenna extends React.Component {
    constructor(props){
        super(props);
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Usuario"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <div>
                                        <h1>Cambiar contraseña</h1>
                                        <h2 className="ms-3 fs-4">{usuario.nombre}</h2>
                                    </div>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="row w-100 m-0 justify-content-center align-items-center" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                      <div className="col-2 p-3" style={{width:"400px"}}>
                                        <ContrasennaForm idUsuario={usuario.id} />
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

export default Contrasenna;