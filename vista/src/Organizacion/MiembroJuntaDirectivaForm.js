import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import manejarCambio from '../Utilidades/manejarCambio';
import Select from 'react-select';
import listaPuestos from '../Utilidades/listaPuestos';

class MiembroJuntaDirectivaForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos ? props.campos : {};
        this.accion = Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar";
        this.titulo = this.accion+" Miembro de Junta Directiva";
        var campos = {
            id_usuario: this.campos.id_usuario ? {
                value: this.campos.id_usuario,
                label: this.campos.nombre,
            } : "",
            puesto: this.campos.puesto ? this.campos.puesto : "",
            edita_pagina: this.campos.edita_pagina ? this.campos.edita_pagina : false,
            edita_junta: this.campos.edita_junta ? this.campos.edita_junta : false,
            edita_proyecto: this.campos.edita_proyecto ? this.campos.edita_proyecto : false,
            edita_actividad: this.campos.edita_actividad ? this.campos.edita_actividad : false,
        };
        this.state = {
            titulo:this.titulo,
            campos:campos,
            errores: {
                hayError:false,
                id_usuario: "",
                puesto:"",
            },
            usuarios:[],
            enviado:false,
        };

        this.validacion = new Validacion({
            id_usuario: "seleccionado",
            puesto: "seleccionado",
        }, this);
        this.usuariosPedidos = false;

        this.enviarMiembro = this.enviarMiembro.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    reiniciarCampos(){
        this.setState({
            campos:{
                id_usuario: "",
                puesto: "",
            },
            titulo:this.titulo,
            enviado:false,
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async enviarMiembro(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                let campos = {
                    id_usuario:this.state.campos.id_usuario.value,
                    id_organizacion:this.props.idOrganizacion,
                    puesto: this.state.campos.puesto ? this.state.campos.puesto : "",
                    edita_pagina: this.state.campos.edita_pagina ? this.state.campos.edita_pagina : false,
                    edita_junta: this.state.campos.edita_junta ? this.state.campos.edita_junta : false,
                    edita_proyecto: this.state.campos.edita_proyecto ? this.state.campos.edita_proyecto : false,
                    edita_actividad: this.state.campos.edita_actividad ? this.state.campos.edita_actividad : false,
                };
                let mensajeExito = "¡Agregado con éxito!";
                let resp;
                if(this.accion === "Modificar"){
                    resp = await this.queriesGenerales.modificar("/puesto/modificar/"+this.props.idPuesto, campos);
                    mensajeExito = "¡Modificado con éxito!";
                } else {
                    resp = await this.queriesGenerales.postear("/puesto/crear", campos);
                }
                
                this.setState({
                    enviado:true,
                    titulo:mensajeExito,
                });
                campos.nombre = this.state.campos.id_usuario.label;
                campos.id = this.props.idPuesto ? this.props.idPuesto : resp.data.id;
                
                this.props.avisaEnviado(campos);
            }catch(error){
                console.log(error);
            }
        }
    }

    async cargarUsuarios(){
        if(this.props.idOrganizacion){
            try{
                var usuarios = this.state.usuarios;
                let params = this.props.esUnion ? {tipo:"Usuario"}: {id_organizacion:this.props.idOrganizacion,tipo:"Usuario"};
                const resp = await this.queriesGenerales.obtener("/usuario/consultar", params);
                var usuariosSelect = [];
                for(let usuario of resp.data){
                    usuariosSelect.push({
                        label:usuario.nombre,
                        value:usuario.id,
                    });
                }
                this.setState({
                    usuarios:usuarios.concat(usuariosSelect),
                });
            } catch(err){
                console.log(err);
            }
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot){
        if(prevProps.idOrganizacion != this.props.idOrganizacion){
            this.cargarUsuarios();
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar
    los usuarios
    */
    componentDidMount() {
        if(!this.usuariosPedidos){
            this.usuariosPedidos = true;
            this.cargarUsuarios();
        }
    }

    render(){
        return (
            <>
            <h2 className="modal-title text-center">{this.state.titulo}</h2>
            {!this.state.enviado ?
            <form onSubmit={this.enviarMiembro} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="id_usuario" className="form-label">Nombre</label>
                    <div className={this.state.errores.id_usuario.length > 0 ? "p-0 form-control is-invalid":"p-0 form-control"}>
                        <Select
                        isDisabled={this.accion === "Modificar"}
                        isClearable
                        key="id_usuario" name="id_usuario" required value={this.state.campos.id_usuario} onChange={(opcion)=>this.manejaCambio({target:{name:"id_usuario",type:"select",value:opcion}})}
                        options={this.state.usuarios}
                        />
                    </div>
                    <div className="invalid-tooltip">
                        {this.state.errores.id_usuario}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="id_puesto_jd" className="form-label">Puesto</label>
                    <select className={this.state.errores.id_puesto_jd.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="id_puesto_jd" name="id_puesto_jd" value={this.state.campos.id_puesto_jd} onChange={this.manejaCambio} >
                        <option defaultValue hidden>Puesto</option>
                        {listaPuestos.map((puesto,i) => <option key={i} value={puesto}>{puesto}</option>)}
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.id_puesto_jd}
                    </div>
                </div>
                <div className="mb-3">
                    <label className="form-label">Permisos</label>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="edita_pagina" name="edita_pagina" checked={this.state.campos.edita_pagina} onChange={this.manejaCambio} />
                        <label className="form-check-label" htmlFor="edita_pagina" >
                            ¿Puede editar páginas?
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="edita_junta" name="edita_junta" checked={this.state.campos.edita_junta} onChange={this.manejaCambio} />
                        <label className="form-check-label" htmlFor="edita_junta" >
                            ¿Puede editar Junta Directiva?
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="edita_proyecto" name="edita_proyecto" checked={this.state.campos.edita_proyecto} onChange={this.manejaCambio} />
                        <label className="form-check-label" htmlFor="edita_proyecto" >
                            ¿Puede editar proyectos?
                        </label>
                    </div>
                    <div className="form-check">
                        <input className="form-check-input" type="checkbox" id="edita_actividad" name="edita_actividad" checked={this.state.campos.edita_actividad} onChange={this.manejaCambio} />
                        <label className="form-check-label" htmlFor="edita_actividad" >
                            ¿Puede editar actividades?
                        </label>
                    </div>
                </div>
                <div className="d-flex justify-content-end">
                    {this.props.cerrarModal ?
                    <div className="m-1">
                        <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.props.cerrarModal();this.reiniciarCampos()}}>Volver</button>
                    </div>:
                    <></>
                    }
                    <div className="m-1">
                        <button type="submit" className="btn btn-primary">{this.accion}</button>
                    </div>
                </div>
            </form>
            :
            <div className="d-flex justify-content-end">
                {this.accion === "Agregar" ? <div className="m-1">
                    <button type="button" className="btn btn-primary" aria-label="Agregar otro" onClick={this.reiniciarCampos}>Agregar otro</button>
                </div>:
                <></>}
                {this.props.cerrarModal ?
                <div className="m-1">
                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.props.cerrarModal();this.reiniciarCampos()}}>Volver</button>
                </div>:
                <></>
                }
            </div>}
            </>
        );
    }
}

export default MiembroJuntaDirectivaForm;