import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import manejarCambio from '../Utilidades/manejarCambio';
import listaPaises from '../Utilidades/listaPaises';

class MiembroJuntaDirectivaForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos;
        var campos = {
            id_usuario: "",
            puesto: "",
        };
        if(props.campos){
            campos = {
                id_junta_directiva:this.props.idJunta,
                id_usuario: props.campos.id_usuario ? props.campos.id_usuario : "",
                puesto: props.campos.puesto ? props.campos.puesto : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                id_usuario: "",
                puesto: "",
            },
            puestos:[],
            agregado:false,
        };

        this.validacion = new Validacion({
            id_usuario: "requerido",
            puesto: "seleccionado",
        }, this);

        this.agregarMiembro = this.agregarMiembro.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    // Falta reiniciar los otros campos
    reiniciarCampos(){
        this.setState({
            agregado:false
        });
    }

    avisaAgregado(){
        this.props.avisaAgregado();
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

    async cargarPuestos(){
        try{
            var puestos = this.state.puestos;
            const resp = await this.queriesGenerales.obtener("/consultarPuestos/"+this.props.idJunta, {});
            this.setState({
                puestos:puestos.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    render(){
        return (
            <>
            {!this.state.agregado ?
            <form onSubmit={this.agregarMiembro} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="id_usuario" className="form-label">Nombre</label>
                    <select type="text" className={this.state.errores.id_usuario.length > 0 ? "form-select is-invalid":"form-select"} key="id_usuario" name="id_usuario" required value={this.state.campos.id_usuario} onChange={this.manejaCambio} >
                        
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.id_usuario}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="puesto" className="form-label">Puesto</label>
                    <select className={this.state.errores.puesto.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="puesto" name="puesto" value={this.state.campos.nacionalidad} onChange={this.manejaCambio} >
                        <option defaultValue>Puesto</option>
                        {this.state.puestos.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.puesto}
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver">Volver</button>
                    </div>
                    <div className="m-1">
                        <button type="submit" className="btn btn-primary">Agregar</button>
                    </div>
                </div>
            </form>
            :
            <div className="d-flex justify-content-end">
                <div className="m-1">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver" onClick={this.reiniciarCampos}>Volver</button>
                </div>
            </div>}
            </>
        );
    }
}

export default MiembroJuntaDirectivaForm;