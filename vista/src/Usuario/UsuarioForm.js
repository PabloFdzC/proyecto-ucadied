import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaElemento from '../Utilidades/AgregaElemento';
import Elementos from '../Utilidades/Elementos';
import Validacion from '../Utilidades/Validacion';
import listaPuestos from '../Utilidades/listaPuestos';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';

class UsuarioForm extends React.Component {
    constructor(props){
        super(props);

        this.queriesGenerales = new QueriesGenerales();
        
        this.campos = props.campos ? props.campos : {};
        this.accion = Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar";
        
        var campos = {
            nombre: this.campos.nombre ? this.campos.nombre : "",
            fecha_nacimiento: this.campos.fecha_nacimiento ? this.campos.fecha_nacimiento : "",
            identificacion: this.campos.identificacion ? this.campos.identificacion : "",
            profesion: this.campos.profesion ? this.campos.profesion : "",
            email: this.campos.email ? this.campos.email : "",
            telefonos:this.campos.telefonos ? this.campos.telefonos : [],
            id_organizacion: this.campos.id_organizacion ? this.campos.id_organizacion : "",
            puesto: this.campos.puesto ? this.campos.puesto : "",
            edita_pagina: this.campos.edita_pagina ? this.campos.edita_pagina : false,
            edita_junta: this.campos.edita_junta ? this.campos.edita_junta : false,
            edita_proyecto: this.campos.edita_proyecto ? this.campos.edita_proyecto : false,
            edita_actividad: this.campos.edita_actividad ? this.campos.edita_actividad : false,
        };
        
        this.state = {
            tabKey:"Usuario",
            titulo: this.accion+ " " +this.props.titulo,
            campos:campos,
            errores: {
                hayError:false,
                nombre: "",
                fecha_nacimiento: "",
                identificacion: "",
                profesion: "",
                email: "",
                telefonos:"",
                id_organizacion:"",
                puesto:"",
            },
            asociaciones:[],
            contrasenna: ""
        };
        
        this.validacion = new Validacion({
            nombre: "requerido",
            fecha_nacimiento: "requerido|fecha",
            identificacion:"requerido|numeros",
            profesion: "requerido",
            telefonos: "tiene-valores",
            email: "requerido|email",
            id_organizacion: props.ocupaAsociacion ? "requerido" : "",
            puesto: props.ocupaPuesto ? "requerido":"",
        }, this);
        
        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.asociacionesPedidas = false;

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.eliminarTelefono = this.eliminarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearUsuario = this.crearUsuario.bind(this);
        this.avisaCreado = this.avisaCreado.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
        this.manejaCambioOrganizacion = this.manejaCambioOrganizacion.bind(this);
    }

    // Falta reiniciar los otros campos
    reiniciarCampos(){
        this.setState({
            titulo: this.props.titulo,
            contrasenna:"",
            campos: Object.assign({},this.state.campos, {
                nombre:"",
                fecha_nacimiento: "",
                identificacion: "",
                profesion: "",
                email: "",
                telefonos:[],
                id_organizacion:"",
                edita_pagina: false,
                edita_junta: false,
                edita_proyecto: false,
                edita_actividad: false,
            })
        });
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
        return !this.state.errores.hayError;
    }

    eliminarTelefono(indice,telefono){
        if (indice > -1){
            this.state.campos.telefonos.splice(indice, 1);
            this.setState({});
        }
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    manejaCambioOrganizacion(evento){
        manejarCambio(evento, this);
    }

    async crearUsuario(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            let url = "usuario";
            if(this.props.administrador){
                url = "administrador";
            }
            try{
                let campos = {
                    nombre: this.state.campos.nombre,
                    fecha_nacimiento: this.state.campos.fecha_nacimiento,
                    identificacion: this.state.campos.identificacion,
                    profesion: this.state.campos.profesion,
                    email: this.state.campos.email,
                    telefonos:this.state.campos.telefonos,
                    id_organizacion: this.state.campos.id_organizacion,
                };
                if(campos.id_organizacion === "" && this.props.idOrganizacion && !isNaN(this.props.idOrganizacion)){
                    campos.id_organizacion = this.props.idOrganizacion;
                }
                if(this.state.campos.puesto !== ""){
                    campos.puesto = this.state.campos.puesto;
                    campos.edita_pagina = this.state.campos.edita_pagina;
                    campos.edita_junta = this.state.campos.edita_junta;
                    campos.edita_proyecto = this.state.campos.edita_proyecto;
                    campos.edita_actividad = this.state.campos.edita_actividad;
                }
                let nuevoEstado = {};
                if(this.accion === "Modificar"){
                    const resp = await this.queriesGenerales.put(url+"/modificar/"+this.props.id, campos); 
                    nuevoEstado.titulo = "¡Modificado con Éxito!";
                } else {
                    const resp = await this.queriesGenerales.postear(url+"/crear", campos); 
                    campos.id = resp.data.usuario_creado.id;
                    if((typeof resp.data.puesto_creado) === 'object' && resp.data.puesto_creado){
                        campos.id_puesto = resp.data.puesto_creado.id;
                    }
                    nuevoEstado.titulo = "¡Agregado con Éxito!";
                    nuevoEstado.contrasenna = resp.data.contrasenna;
                }
                this.setState(nuevoEstado);
                this.avisaCreado(campos);
            }catch(error){
                console.log(error);
            }
        } else {
            if(this.state.errores.nombre.length !== 0 || this.state.errores.fecha_nacimiento.length !== 0 ||
                this.state.errores.identificacion.length !== 0 || this.state.errores.profesion.length !== 0 ||
                this.state.errores.telefonos.length !== 0 || this.state.errores.email.length !== 0){
                this.setState({
                    tabKey:"Usuario"
                });
            } else if(this.state.errores.id_organizacion.length !== 0 || this.state.errores.puesto.length !== 0){
                this.setState({
                    tabKey:"Asociación",
                });

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

    async avisaCreado(usuario){
        this.props.avisaCreado(usuario);
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
                <form onSubmit={this.crearUsuario} noValidate>
                    <Tab.Container id="left-tabs-example" activeKey={this.state.tabKey} onSelect={(tabKey) => this.setState({tabKey})}>
                        {this.props.ocupaAsociacion || this.props.ocupaPuesto ? 
                            <Row>
                                <Nav variant="pills" className="justify-content-center">
                                <Nav.Item>
                                    <Nav.Link eventKey="Usuario">Usuario</Nav.Link>
                                </Nav.Item>
                                <Nav.Item>
                                    <Nav.Link eventKey="Asociación">Asociación</Nav.Link>
                                </Nav.Item>
                                </Nav>
                            </Row> : <></>
                        }
                        <Row>
                            <Tab.Content>
                            <Tab.Pane eventKey="Usuario">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="nombre" className="form-label">Nombre</label>
                                        <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                                        <div className="invalid-tooltip">
                                            {this.state.errores.nombre}
                                        </div>
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="fecha_nacimiento" className="form-label">Fecha de nacimiento</label>
                                        <input type="date" className={this.state.errores.fecha_nacimiento.length > 0 ? "form-control is-invalid":"form-control"} key="fecha_nacimiento" name="fecha_nacimiento" required value={this.state.campos.fecha_nacimiento} onChange={this.manejaCambio} />
                                        <div className="invalid-tooltip">
                                            {this.state.errores.fecha_nacimiento}
                                        </div>
                                    </div>
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="identificacion" className="form-label">Identificación o DIMEX</label>
                                        <input type="text" className={this.state.errores.identificacion.length > 0 ? "form-control is-invalid":"form-control"} key="identificacion" name="identificacion" required value={this.state.campos.identificacion} onChange={this.manejaCambio} />
                                        <div className="invalid-tooltip">
                                            {this.state.errores.identificacion}
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
                                <div className="col-12 col-md-6">
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} onChange={this.manejaCambio} />
                                        <div className="invalid-tooltip">
                                            {this.state.errores.email}
                                        </div>
                                    </div>
                                    <AgregaElemento titulo={"Teléfonos"} agregarElemento={this.agregarTelefono} error={this.state.errores.telefonos} />
                                    <Elementos elementos={this.state.campos.telefonos} eliminarTelefono={this.eliminarTelefono} />
                                </div>
                            </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="Asociación">
                            <div className="row">
                                <div className="col-12 col-md-6">
                                {this.props.ocupaAsociacion ? 
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="asociacion" className="form-label">Asociación</label>
                                        <select className={this.state.errores.id_organizacion.length > 0 ? "form-select is-invalid":"form-select"} aria-label="asociacion" key="asociacion" name="id_organizacion" value={this.state.campos.id_organizacion} onChange={this.manejaCambioOrganizacion} >
                                            <option defaultValue hidden>Asociación</option>
                                            {this.state.asociaciones.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                                        </select>
                                        <div className="invalid-tooltip">
                                            {this.state.errores.id_organizacion}
                                        </div>
                                    </div>
                                :<></>}
                                {this.props.ocupaPuesto ? 
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="puesto" className="form-label">Puesto en Junta Directiva</label>
                                        <select className={this.state.errores.puesto.length > 0 ? "form-select is-invalid":"form-select"} aria-label="puesto" key="puesto" name="puesto" value={this.state.campos.puesto} onChange={this.manejaCambio}>
                                            <option defaultValue hidden>Puesto en Junta Directiva</option>
                                            {listaPuestos.map((puesto,i) => <option key={i} value={puesto}>{puesto}</option>)}
                                        </select>
                                        
                                        <div className="invalid-tooltip">
                                            {this.state.errores.puesto}
                                        </div>
                                    </div>
                                :<></>}
                                </div>
                                {this.props.ocupaPuesto ? 
                                <div className="col-12 col-md-6">
                                    <label className="form-label">Permisos</label>
                                    <div className="mb-3">
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
                                </div>
                                :<></>}
                            </div>
                            </Tab.Pane>
                            </Tab.Content>
                        </Row>
                    </Tab.Container>
                    
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
                </form>:
            <>
            <div className="d-flex flex-column center-text justify-content-center align-items-center">
                <h4 className="modal-title">Contraseña</h4>
                <p>{this.state.contrasenna}</p> 
            </div>
            <div className="d-flex justify-content-end">
                {this.props.cerrarModal ?
                <div className="m-1">
                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.props.cerrarModal();this.reiniciarCampos()}}>Volver</button>
                </div>:
                <></>
                }
            </div>
            </>}
            </>
        );
    }
}

export default UsuarioForm;