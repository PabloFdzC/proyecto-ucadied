import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

class PuestoForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.url = props.url;
        this.agregarPuesto = props.agregarPuesto;
        this.campos = props.campos;
        this.state = {
            nombre: "",
            funcion: ""
        };
        var campos = {
            nombre: "",
            funcion: "",
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                funcion: props.campos.funcion ? props.campos.funcion : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                nombre: "",
                funcion:""
            }
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            funcion: "requerido"
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearPuesto = this.crearPuesto.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearPuesto(evento){
        evento.preventDefault();
        const datos = this.state;
        this.validacion.validarCampos(this.state.campos);
        try{
            await this.queriesGenerales.postear("/organizacion/crear", this.state.campos);
        }catch(error){
            console.log(error);
        }
    }

    render(){
        return (
            <form onSubmit={this.crearPuesto} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nombre}
                    </div>
                </div>
                
                <div className="mb-3 position-relative">
                    <label htmlFor="funcion" className="form-label">Funcion</label>
                    <input type="text" className={this.state.errores.funcion.length > 0 ? "form-control is-invalid":"form-control"} key="funcion" name="funcion" required value={this.state.campos.funcion} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.funcion}
                    </div>
                </div>
                <div className="form-check">
                    <input className="form-check-input" type="checkbox" id="necesitaCuenta" checked={this.state.campos.necesitaCuenta} onChange={this.manejaCambio} />
                    <label className="form-check-label" htmlFor="necesitaCuenta" >
                        ¿Necesita cuenta?
                    </label>
                </div>
                <button type="button" className="btn btn-secondary">Volver</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        );
    }
}

export default PuestoForm;