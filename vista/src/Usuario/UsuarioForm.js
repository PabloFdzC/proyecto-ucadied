import React from 'react';
import { postear } from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaTelefono from './AgregaTelefono';
import Telefonos from './Telefonos';

class UsuarioForm extends React.Component {
    constructor(props){
        super(props);
        this.url = props.url;
        this.administrador = props.administrador;

        this.state = {
            nombre: "",
            necesitaCuenta: false,
            nacimiento: "",
            nacionalidad: "",
            profesion: "",
            email: "",
            telefonos:[]
        };

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
    }

    agregarTelefono(telefono){
        console.log("agregaTel:"+telefono)
        let telefonos = this.state.telefonos.concat(telefono);
        console.log("agregaTels:"+telefonos)
        this.setState({telefonos:telefonos});
    }

    eliminarTelefono(telefono){
        let i = this.state.telefonos.indexOf(telefono);
        if (i > -1){
            let telefonos = this.state.telefonos.splice(i, 1);
            this.setState({telefonos:telefonos});
        }
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    // Aquí se mandaría la información al server
    async crearUsuario(evento){
        evento.preventDefault();
        const datos = this.state;
        console.log(datos)

        let url = "/usuario";
        if(this.administrador){
            url = "/administrador"
        }
        try{
            await postear(url+"/crear", datos);
        }catch(error){
            //console.log(error);
        }
    }

    render(){
        let necesitaCuentaChck;
        if(!this.props.administrador){
            necesitaCuentaChck = (
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="necesitaCuenta" name="necesitaCuenta" checked={this.state.necesitaCuenta} onChange={this.manejaCambio} />
                <label className="form-check-label" htmlFor="necesitaCuenta" >
                    ¿Necesita cuenta?
                </label>
            </div>);
        }
        return (
            <form onSubmit={this.crearUsuario} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" key="nombre" name="nombre" required value={this.state.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        Se ocupa un nombre.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="nacimiento" className="form-label">Fecha de nacimiento</label>
                    <input type="date" className="form-control" key="nacimiento" name="nacimiento" required value={this.state.nacimiento} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        Se ocupa una fecha de nacimiento.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="nacionalidad" className="form-label">Nacionalidad</label>
                    <select className="form-select" aria-label="nacionalidad" key="nacionalidad" name="nacionalidad" value={this.state.nacionalidad} onChange={this.manejaCambio} >
                        <option defaultValue>Nacionalidad</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="invalid-tooltip">
                        Se ocupa una nacionalidad.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="profesion" className="form-label">Profesión</label>
                    <input type="text" className="form-control" key="profesion" name="profesion" value={this.state.profesion} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        Se ocupa una profesión.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" key="email" name="email" value={this.state.email} onChange={this.manejaCambio} />
                </div>
                {necesitaCuentaChck}
                <AgregaTelefono agregarTelefono={this.agregarTelefono} />
                <Telefonos telefonos={this.state.telefonos} eliminarTelefono={this.eliminarTelefono} />
                <button type="button" className="btn btn-secondary">Volver</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        );
    }
}

export default UsuarioForm;