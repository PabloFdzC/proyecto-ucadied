import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import manejarCambio from '../Utilidades/manejarCambio';

class MiembroJuntaDirectivaForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos;
        var campos = {
            nombre: "",
            necesitaCuenta: this.administrador,
            nacimiento: "",
            nacionalidad: "",
            profesion: "",
            email: "",
            telefonos:[],
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                puesto: props.campos.puesto ? props.campos.puesto : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                nombre: "",
                puesto: "",
            }
        };

        this.validacion = new Validacion({
            nombre: "requerido",
            puesto: "seleccionado",
        }, this);

        this.agregarMiembro = this.agregarMiembro.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async agregarMiembro(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                await this.queriesGenerales.postear("/juntaDirectiva/agregarMiembro", this.state.campos);
            }catch(error){
                console.log(error);
            }
        }
    }

    render(){
        return (
            <form onSubmit={this.agregarMiembro} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nombre}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="puesto" className="form-label">Puesto</label>
                    <select className={this.state.errores.puesto.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="puesto" name="puesto" value={this.state.campos.nacionalidad} onChange={this.manejaCambio} >
                        <option defaultValue>Puesto</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.puesto}
                    </div>
                </div>
                <button type="button" className="btn btn-dark">Agregar puesto</button>
                <button type="submit" className="btn btn-primary">Agregar miembro</button>
            </form>
        );
    }
}

export default MiembroJuntaDirectivaForm;