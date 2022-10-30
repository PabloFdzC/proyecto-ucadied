import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import manejarCambio from '../Utilidades/manejarCambio';
import Select from 'react-select';

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
            id_puesto_jd: this.campos.id_puesto_jd ? this.campos.id_puesto_jd : "",
        };
        this.state = {
            titulo:this.titulo,
            campos:campos,
            errores: {
                hayError:false,
                id_usuario: "",
                id_puesto_jd: "",
            },
            usuarios:[],
            agregado:false,
        };

        this.validacion = new Validacion({
            id_usuario: "seleccionado",
            id_puesto_jd: "seleccionado",
        }, this);
        this.usuariosPedidos = false;

        this.agregarMiembro = this.agregarMiembro.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    reiniciarCampos(){
        this.setState({
            campos:{
                id_usuario: "",
                id_puesto_jd: "",
            },
            titulo:this.titulo,
            agregado:false,
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async agregarMiembro(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                var campos = {};
                var mensajeExito = "¡Agregado con éxito!";
                campos.id_usuario = this.state.campos.id_usuario.value;
                campos.id_puesto_jd = this.state.campos.id_puesto_jd;
                campos.id_organizacion = this.props.idOrganizacion;
                await this.queriesGenerales.postear("/juntaDirectiva/agregarMiembro", campos);
                this.setState({
                    agregado:true,
                    titulo:mensajeExito,
                });
                var usuario = {};
                for(let u of this.state.usuarios){
                    if(u.value == campos.id_usuario){
                        usuario.id_usuario = u.value;
                        usuario.nombre = u.label;
                    }
                }
                for(let p of this.props.puestos){
                    if(p.id == campos.id_puesto_jd){
                        usuario.id_puesto_jd = p.id;
                        usuario.puesto = p.nombre;
                    }
                }
                this.props.avisaAgregado(usuario);
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
            {!this.state.agregado ?
            <form onSubmit={this.agregarMiembro} className="needs-validation" noValidate>
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
                        {this.props.puestos.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.id_puesto_jd}
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