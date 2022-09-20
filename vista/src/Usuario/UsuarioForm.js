import React from 'react';
import Modal from 'react-bootstrap/Modal';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaTelefono from './AgregaTelefono';
import Telefonos from './Telefonos';
import Validacion from '../Utilidades/Validacion';
import listaPaises from '../Utilidades/listaPaises';

class UsuarioForm extends React.Component {
    constructor(props){
        super(props);
        this.url = props.url;
        this.administrador = props.administrador;
        this.ocupaAsociacion = props.ocupaAsociacion;

        this.queriesGenerales = new QueriesGenerales();
        
        this.campos = props.campos;
        
        var campos = {
            nombre: "",
            necesitaCuenta: this.administrador,
            fecha_nacimiento: "",
            nacionalidad: "",
            sexo:"",
            profesion: "",
            email: "",
            telefonos:[],
            id_organizacion:"",
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                necesitaCuenta: this.administrador || props.campos.email,
                fecha_nacimiento: props.campos.fecha_nacimiento ? props.campos.fecha_nacimiento : "",
                nacionalidad: props.campos.nacionalidad ? props.campos.nacionalidad : "",
                sexo:props.campos.sexo ? props.campos.sexo : "",
                profesion: props.campos.profesion ? props.campos.profesion : "",
                email: props.campos.email ? props.campos.email : "",
                telefonos:props.campos.telefonos ? props.campos.telefonos : [],
                id_organizacion: props.campos.id_organizacion ? props.campos.id_organizacion : "",
            };
        }
        
        this.state = {
            titulo:this.props.titulo,
            campos:campos,
            errores: {
                hayError:false,
                nombre: "",
                fecha_nacimiento: "",
                nacionalidad: "",
                sexo:"",
                profesion: "",
                email: "",
                telefonos:"",
                id_organizacion:""
            },
            asociaciones:[],
            contrasenna: ""
        };
        
        this.validacion = new Validacion({
            nombre: "requerido",
            fecha_nacimiento: "requerido",
            nacionalidad: "seleccionado",
            sexo: "seleccionado",
            profesion: "requerido",
            telefonos: "tiene-valores",
            id_organizacion: props.ocupaAsociacion ? "requerido" : "",
        }, this);
        
        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.eliminarTelefono = this.eliminarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.avisaCreado = this.avisaCreado.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    // Falta reiniciar los otros campos
    reiniciarCampos(){
        //this.setState({});
    }


    agregarTelefono(telefono){
        this.validacionTelefono.validarCampos({telefonos:telefono});
        if(!this.state.errores.hayError){
            let telefonos = this.state.campos.telefonos.concat(telefono);
            this.setState({
                campos: Object.assign({},this.state.campos, {
                    telefonos:telefonos
                }),
                errores: Object.assign({}, this.state.errores, {
                    telefonos: "",
                })
            });
        }
    }

    eliminarTelefono(telefono){
        let i = this.state.campos.telefonos.indexOf(telefono);
        if (i > -1){
            this.state.campos.telefonos.splice(i, 1);
            this.setState({});
        }
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearUsuario(evento){
        evento.preventDefault();
        if (this.state.campos.necesitaCuenta){
            this.validacion.agregarRegla("email", "requerido|email");
        } else {
            this.validacion.eliminarRegla("email");
        }
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            let url = "usuario";
            if(this.administrador){
                url = "administrador";
            } else if(!this.state.campos.necesitaCuenta){
                url = "persona";
            }
            try{
                const res = await this.queriesGenerales.postear(url+"/crear", this.state.campos);
                this.setState({
                    titulo:"¡Agregado con Éxito!",
                    contrasenna:res.data.contrasenna,
                });
                this.avisaCreado();
            }catch(error){
                console.log(error);
            }
        }
    }

    async cargarAsociaciones(){
        try{
            var asociaciones = this.state.asociaciones;
            const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/0", {});
            this.setState({
                asociaciones:asociaciones.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    async avisaCreado(){
        this.props.avisaCreado();
    }

    componentDidMount() {
        if(this.props.ocupaAsociacion){
            if(!this.asociacionesPedidas){
                this.asociacionesPedidas = true;
                this.cargarAsociaciones();
            }
        }
    }

    render(){
        return (
            <>
            <h2 className="modal-title text-center">{this.state.titulo}</h2>
            {this.state.contrasenna === "" ?
            <form onSubmit={this.crearUsuario}  noValidate>
                <div className="row">
                    <div className="col">
                        <div className="mb-3 position-relative">
                            <label htmlFor="nombre" className="form-label">Nombre</label>
                            <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.nombre}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="fecha_nacimiento" className="form-label">Fecha de fecha_nacimiento</label>
                            <input type="date" className={this.state.errores.fecha_nacimiento.length > 0 ? "form-control is-invalid":"form-control"} key="fecha_nacimiento" name="fecha_nacimiento" required value={this.state.campos.fecha_nacimiento} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.fecha_nacimiento}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="nacionalidad" className="form-label">Nacionalidad</label>
                            <select className={this.state.errores.nacionalidad.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="nacionalidad" name="nacionalidad" value={this.state.campos.nacionalidad} onChange={this.manejaCambio} >
                                <option defaultValue>Nacionalidad</option>
                                {listaPaises.map((pais, i)=><option key={i} value={pais}>{pais}</option>)}
                            </select>
                            <div className="invalid-tooltip">
                                {this.state.errores.nacionalidad}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="sexo" className="form-label">Sexo</label>
                            <select className={this.state.errores.sexo.length > 0 ? "form-select is-invalid":"form-select"} aria-label="sexo" key="sexo" name="sexo" value={this.state.campos.sexo} onChange={this.manejaCambio} >
                                <option defaultValue>Sexo</option>
                                <option value={"Masculino"}>Masculino</option>
                                <option value={"Femenino"}>Femenino</option>
                                <option value={"No Especificado"}>No Especificado</option>
                            </select>
                            <div className="invalid-tooltip">
                                {this.state.errores.sexo}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="profesion" className="form-label">Profesión</label>
                            <input type="text" className={this.state.errores.profesion.length > 0 ? "form-control is-invalid":"form-control"} key="profesion" name="profesion" value={this.state.campos.profesion} onChange={this.manejaCambio} required />
                            <div className="invalid-tooltip">
                                {this.state.errores.profesion}
                            </div>
                        </div>

                    </div>
                    <div className="col">
                        {this.props.ocupaAsociacion ?
                            <div className="mb-3 position-relative">
                                <label htmlFor="asociacion" className="form-label">Asociación</label>
                                <select className={this.state.errores.nacionalidad.length > 0 ? "form-select is-invalid":"form-select"} aria-label="asociacion" key="asociacion" name="id_organizacion" value={this.state.campos.id_organizacion} onChange={this.manejaCambio} >
                                    <option defaultValue>Asociación</option>
                                    {this.state.asociaciones.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                                </select>
                                <div className="invalid-tooltip">
                                    {this.state.errores.nacionalidad}
                                </div>
                            </div>:
                        <></>}
                        <AgregaTelefono agregarTelefono={this.agregarTelefono} error={this.state.errores.telefonos} />
                        <Telefonos telefonos={this.state.campos.telefonos} eliminarTelefono={this.eliminarTelefono} />
                        <div className="mb-3 position-relative">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="email" disabled={!this.state.campos.necesitaCuenta} className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.email}
                            </div>
                        </div>

                        {!this.props.administrador ?
                            <div className="form-check">
                                <input className="form-check-input" type="checkbox" id="necesitaCuenta" name="necesitaCuenta" checked={this.state.campos.necesitaCuenta} onChange={this.manejaCambio} />
                                <label className="form-check-label" htmlFor="necesitaCuenta" >
                                    ¿Necesita cuenta?
                                </label>
                            </div>:
                        <></>}
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
            </form>:
            <>
            <div className="d-flex flex-column center-text justify-content-center align-items-center">
                <h4 className="modal-title">Contraseña</h4>
                <p>{this.state.contrasenna}</p> 
            
            </div>
            <div className="d-flex justify-content-end">
                <div className="m-1">
                    <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" aria-label="Volver" onClick={this.reiniciarCampos}>Volver</button>
                </div>
            </div>
            </>}
            </>
        );
    }
}

export default UsuarioForm;