import React from 'react';
import { postear } from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';

class IniciarSesionForm extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            email:"",
            contrasenna:"",
        }

        this.manejaCambio = this.manejaCambio.bind(this);
        this.iniciarSesion = this.iniciarSesion.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    // Aquí se mandaría la información al server
    async iniciarSesion(evento){
        evento.preventDefault();
        const datos = new FormData(evento.target);
        try{
            await postear("/iniciarSesion", datos);
        }catch(error){
            //console.log(error);
        }
    }

    render(){
        return (
            <form onSubmit={this.iniciarSesion} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" key="email" name="email" required onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        Se ocupa un email.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="contraseña" className="form-label">contraseña</label>
                    <input type="password" className="form-control" key="contraseña" name="contrasenna" required onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        Se ocupa una contraseña.
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Iniciar Sesión</button>
            </form>
        );
    }
}

export default IniciarSesionForm;