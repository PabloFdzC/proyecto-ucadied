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
            id_organizacion: this.props.idOrganizacion,
            n_miembros: "",
            forma_elegir: "",
        };
        if(props.campos){
            campos = {
                id_organizacion: this.props.idOrganizacion,
                n_miembros: props.campos.n_miembros ? props.campos.n_miembros : "",
                forma_elegir: props.campos.forma_elegir ? props.campos.forma_elegir : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                n_miembros: "",
                forma_elegir: "",
            },
            creado:false,
        };

        this.validacion = new Validacion({
            n_miembros: "requerido|numeros",
            forma_elegir: "requerido",
        }, this);

        this.crearJuntaDirectiva = this.crearJuntaDirectiva.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    // Falta reiniciar los otros campos
    reiniciarCampos(){
        this.setState({
            creado:false
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearJuntaDirectiva(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                const resp = await this.queriesGenerales.postear("/juntaDirectiva/crear", this.state.campos);
                console.log(resp);
                this.props.creaJunta(resp.data);
            }catch(error){
                console.log(error);
            }
        }
    }

    render(){
        return (
            <form onSubmit={this.crearJuntaDirectiva} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="n_miembros" className="form-label">Cantidad de miembros</label>
                    <input type="text" className={this.state.errores.n_miembros.length > 0 ? "form-control is-invalid":"form-control"} key="n_miembros" name="n_miembros" required value={this.state.campos.n_miembros} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.n_miembros}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="forma_elegir" className="form-label">Forma de elegir</label>
                    <textarea className={this.state.errores.forma_elegir.length > 0 ? "form-control is-invalid":"form-control"} aria-label="formadeElegir" key="forma_elegir" name="forma_elegir" value={this.state.campos.forma_elegir} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.forma_elegir}
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                        <button type="submit" className="btn btn-primary">Crear</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default JuntaDirectivaForm;