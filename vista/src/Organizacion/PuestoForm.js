import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

class PuestoForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.url = props.url;
        this.titulo = "Agregar Puesto";
        var campos = {
            id_junta_directiva:props.idJunta,
            nombre: "",
            funcion: "",
            edita_pagina: false
        };
        this.state = {
            titulo: this.titulo,
            campos:campos,
            errores: {
                nombre: "",
                funcion:""
            },
            creado:false,
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            funcion: "requerido"
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearPuesto = this.crearPuesto.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    reiniciarCampos(){
        this.setState({
            titulo: this.titulo,
            creado:false,
            campos: Object.assign({},this.state.campos, {
                nombre: "",
                funcion: "",
                edita_pagina: false
            })
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearPuesto(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        let datos = this.state.campos;
        datos.id_junta_directiva = this.props.idJunta;
        try{
            const resp = await this.queriesGenerales.postear("/juntaDirectiva/crearPuesto", datos);
            console.log(resp);
            this.setState({
                creado:true,
            });
        }catch(error){
            console.log(error);
        }
    }

    render(){
        return (<>
                <h2 className="modal-title text-center">{this.state.titulo}</h2>
                {!this.state.creado ? 
                <form onSubmit={this.crearPuesto} className="needs-validation" noValidate>
                    <div className="mb-3 position-relative">
                        <label htmlFor="nombre" className="form-label">Nombre</label>
                        <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                        <div className="invalid-tooltip">
                            {this.state.errores.nombre}
                        </div>
                    </div>
                    
                    <div className="mb-3 position-relative">
                        <label htmlFor="funcion" className="form-label">Función</label>
                        <input type="text" className={this.state.errores.funcion.length > 0 ? "form-control is-invalid":"form-control"} key="funcion" name="funcion" required value={this.state.campos.funcion} onChange={this.manejaCambio} />
                        <div className="invalid-tooltip">
                            {this.state.errores.funcion}
                        </div>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="edita_pagina" name="edita_pagina" checked={this.state.campos.edita_pagina} onChange={this.manejaCambio} />
                        <label className="form-check-label" htmlFor="edita_pagina" >
                            ¿Puede editar páginas?
                        </label>
                    </div>
                    <div className="d-flex justify-content-end">
                        <div className="m-1">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver">Volver</button>
                        </div>
                        <div className="m-1">
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div>
                    </div>
                </form>
                :
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                    <button type="button" className="btn btn-primary" aria-label="Agregar Otro" onClick={this.reiniciarCampos}>Agregar Otra</button>
                    </div>
                    <div className="m-1">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver" onClick={this.reiniciarCampos}>Volver</button>
                    </div>
                </div>
                }
        </>
        );
    }
}

export default PuestoForm;