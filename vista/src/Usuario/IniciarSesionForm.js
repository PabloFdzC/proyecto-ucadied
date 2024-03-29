import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Toast from 'react-bootstrap/Toast';
import { Link } from 'react-router-dom';

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
            muestraMensajeError:false,
            mensajeError:"",
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
                this.setState({
                    mensajeError:error.response.data.error,
                    muestraMensajeError:true,
                });
            }
        }
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario,iniciarSesionUsuario,organizacion})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <Navigate to='/unionCantonal' replace={true}/>
                        );
                    } else if(usuario.tipo === "Usuario"){
                        return (
                            <Navigate to={'/principal/'+organizacion.id} replace={true}/>
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
                            <Link to="/olvidaContrasenna" style={{color:"#FFF"}}>  Olvidé mi contraseña</Link>
                        </div> 
                        <div className="d-flex justify-content-center mt-2">
                            <button type="submit" className="btn btn-primary btn-lg">Iniciar Sesión</button>
                        </div>
                        <div style={{position:"fixed", right:0, bottom:0}}>
                            <Toast bg="danger" onClose={() => this.setState({muestraMensajeError:false,mensajeError:""})} show={this.state.muestraMensajeError} delay={4000} autohide>
                            <Toast.Header>
                                <strong className="me-auto">Error</strong>
                            </Toast.Header>
                            <Toast.Body>{this.state.mensajeError}</Toast.Body>
                            </Toast>
                        </div>
                    </form>);
                }}
                
            </usuarioContexto.Consumer>
            
        );
    }
}

export default IniciarSesionForm;