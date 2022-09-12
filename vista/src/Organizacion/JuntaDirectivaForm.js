import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import manejarCambio from '../Utilidades/manejarCambio';

class JuntaDirectivaForm extends React.Component {
    constructor(props){
        super(props);

        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos;
        var campos = {
            numeroMiembros: "",
            formaElegir: "",
        };
        if(props.campos){
            campos = {
                numeroMiembros: props.campos.numeroMiembros ? props.campos.numeroMiembros : "",
                formaElegir: props.campos.formaElegir ? props.campos.formaElegir : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                numeroMiembros: "",
                formaElegir: "",
            }
        };

        this.validacion = new Validacion({
            numeroMiembros: "requerido|numeros",
            formaElegir: "requerido",
        }, this);

        this.crearJuntaDirectiva = this.crearJuntaDirectiva.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearJuntaDirectiva(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                await this.queriesGenerales.postear("/juntaDirectiva/crear", this.state.campos);
            }catch(error){
                console.log(error);
            }
        }
    }

    render(){
        return (
            <form onSubmit={this.crearJuntaDirectiva} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="numeroMiembros" className="form-label">Cantidad de miembros</label>
                    <input type="text" className={this.state.errores.numeroMiembros.length > 0 ? "form-control is-invalid":"form-control"} key="numeroMiembros" name="numeroMiembros" required value={this.state.campos.numeroMiembros} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.numeroMiembros}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="formaElegir" className="form-label">Forma de elegir</label>
                    <textarea className={this.state.errores.formaElegir.length > 0 ? "form-select is-invalid":"form-select"} aria-label="formadeElegir" key="formaElegir" name="formaElegir" value={this.state.campos.formaElegir} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.formaElegir}
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Crear</button>
            </form>
        );
    }
}

export default JuntaDirectivaForm;