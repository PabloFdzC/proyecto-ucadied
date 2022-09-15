import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';

class IniciarSesionForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            campos:{
                email:"",
                contrasenna:"",
            },
            errores:{
                hayError:false,
                email:"",
                contrasenna:"",
            },
        }

        this.validacion = new Validacion({
            email: "requerido|email",
            contrasenna: "requerido",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.iniciarSesion = this.iniciarSesion.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    // Aquí se mandaría la información al server
    async iniciarSesion(evento, iniciarSesionUsuario){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                const resp = await this.queriesGenerales.postear("/usuario/iniciarSesion", this.state.campos);
                iniciarSesionUsuario(resp.data);
            }catch(error){
                console.log(error);
            }
        }
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario,iniciarSesionUsuario})=>{
                    console.log(usuario);
                    if(usuario.tipo === "Administrador"){
                        return (
                            <Navigate to='/unionCantonal' replace={true}/>
                        );
                    } else if(usuario.tipo === "Usuario"){
                        return (
                            <Navigate to='/principal' replace={true}/>
                        );
                    }
                    return (<form onSubmit={(evento) => {this.iniciarSesion(evento, iniciarSesionUsuario)}} className="needs-validation" noValidate>
                        <div className="pl-3 pr-3">
                            <div className="mb-3 position-relative">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} required onChange={this.manejaCambio} />
                                <div className="invalid-tooltip">
                                    {this.state.errores.email}
                                </div>
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="contraseña" className="form-label">Contraseña</label>
                                <input type="password" className={this.state.errores.contrasenna.length > 0 ? "form-control is-invalid":"form-control"} key="contraseña" name="contrasenna" value={this.state.campos.contrasenna} required onChange={this.manejaCambio} />
                                <div className="invalid-tooltip">
                                    {this.state.errores.contrasenna}
                                </div>
                            </div>
                        </div> 
                        <div className="d-flex justify-content-center">
                            <button type="submit" className="btn btn-primary btn-lg">Iniciar Sesión</button>
                        </div>
                        
                    </form>);
                }}
                
            </usuarioContexto.Consumer>
            
        );
    }
}

export default IniciarSesionForm;