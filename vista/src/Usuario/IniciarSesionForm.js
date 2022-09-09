import React from 'react';
import { postear } from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

class IniciarSesionForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            campos:{
                email:"",
                contrasenna:"",
            },
            errores:{
                hayError:false,
                email:"",
                contrasenna:"",
            }
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
    async iniciarSesion(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                await postear("/iniciarSesion", this.state.campos);
            }catch(error){
                console.log(error);
            }
        }
    }

    render(){
        return (
            <form onSubmit={this.iniciarSesion} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} required onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.email}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="contraseña" className="form-label">contraseña</label>
                    <input type="password" className={this.state.errores.contrasenna.length > 0 ? "form-control is-invalid":"form-control"} key="contraseña" name="contrasenna" value={this.state.campos.contrasenna} required onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.contrasenna}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>
        );
    }
}

export default IniciarSesionForm;