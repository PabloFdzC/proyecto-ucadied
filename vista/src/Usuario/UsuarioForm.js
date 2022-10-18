import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaElemento from '../Utilidades/AgregaElemento';
import Elementos from '../Utilidades/Elementos';
import Validacion from '../Utilidades/Validacion';
import listaPaises from '../Utilidades/listaPaises';

class UsuarioForm extends React.Component {
    constructor(props){
        super(props);

        this.queriesGenerales = new QueriesGenerales();
        
        this.campos = props.campos ? props.campos : {};
        this.titulo = Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar";
        
        var campos = {
            nombre: this.campos.nombre ? this.campos.nombre : "",
            fecha_nacimiento: this.campos.fecha_nacimiento ? this.campos.fecha_nacimiento : "",
            nacionalidad: this.campos.nacionalidad ? this.campos.nacionalidad : "",
            sexo:this.campos.sexo ? this.campos.sexo : "",
            profesion: this.campos.profesion ? this.campos.profesion : "",
            email: this.campos.email ? this.campos.email : "",
            telefonos:this.campos.telefonos ? this.campos.telefonos : [],
            id_organizacion: this.campos.id_organizacion ? this.campos.id_organizacion : "",
            puesto: this.campos.puesto ? this.campos.puesto : ""
        };
        
        this.state = {
            titulo: this.titulo+ " " +this.props.titulo,
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
                id_organizacion:"",
                puesto:"",
            },
            puestos:[],
            asociaciones:[],
            contrasenna: ""
        };
        
        this.validacion = new Validacion({
            nombre: "requerido",
            fecha_nacimiento: "requerido|fecha",
            nacionalidad: "seleccionado",
            sexo: "seleccionado",
            profesion: "requerido",
            telefonos: "tiene-valores",
            email: "requerido|email",
            puesto: props.ocupaAsociacion || props.idOrganizacion ? "seleccionado" : "",
            id_organizacion: props.ocupaAsociacion ? "requerido" : "",
        }, this);
        
        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.asociacionesPedidas = false;
        this.puestosPedidos = false;

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
                nacionalidad: "",
                sexo:"",
                profesion: "",
                email: "",
                telefonos:[],
                id_organizacion:"",
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
        this.cargarPuestos(parseInt(evento.target.value));
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
                var campos = {
                    nombre: this.state.campos.nombre,
                    fecha_nacimiento: this.state.campos.fecha_nacimiento,
                    nacionalidad: this.state.campos.nacionalidad,
                    sexo:this.state.campos.sexo,
                    profesion: this.state.campos.profesion,
                    email: this.state.campos.email,
                    telefonos:this.state.campos.telefonos,
                    id_organizacion: this.state.campos.id_organizacion,
                    puesto: this.state.campos.puesto,
                };
                if(campos.id_organizacion === "" && this.props.idOrganizacion && !isNaN(this.props.idOrganizacion)){
                    campos.id_organizacion = this.props.idOrganizacion;
                }
                const resp = await this.queriesGenerales.postear(url+"/crear", campos);
                this.setState({
                    titulo:"¡Agregado con Éxito!",
                    contrasenna:resp.data.contrasenna,
                });
                var usuario = resp.data.usuario_creado;
                usuario.persona = resp.data.persona_creada;
                usuario.puesto = this.state.campos.puesto;
                this.avisaCreado(usuario);
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

    async cargarPuestos(idOrganizacion){
        try{
            var puestos = this.state.puestos;
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultarPuestos/"+idOrganizacion, {});
            this.setState({
                puestos:puestos.concat(resp.data),
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
        if(!isNaN(this.props.idOrganizacion) && !this.puestosPedidos){
            this.puestosPedidos = true;
            this.cargarPuestos(parseInt(this.props.idOrganizacion));
        }
    }

    render(){
        return (
            <>
            <h2 className="modal-title text-center">{this.state.titulo}</h2>
            {this.state.contrasenna === "" ?
                <form onSubmit={this.crearUsuario} noValidate>
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
                                <label htmlFor="nacionalidad" className="form-label">Nacionalidad</label>
                                <select className={this.state.errores.nacionalidad.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="nacionalidad" name="nacionalidad" value={this.state.campos.nacionalidad} onChange={this.manejaCambio} >
                                    <option defaultValue hidden>Nacionalidad</option>
                                    {listaPaises.map((pais, i)=><option key={i} value={pais}>{pais}</option>)}
                                </select>
                                <div className="invalid-tooltip">
                                    {this.state.errores.nacionalidad}
                                </div>
                            </div>
                            <div className="mb-3 position-relative">
                                <label htmlFor="sexo" className="form-label">Sexo</label>
                                <select className={this.state.errores.sexo.length > 0 ? "form-select is-invalid":"form-select"} aria-label="sexo" key="sexo" name="sexo" value={this.state.campos.sexo} onChange={this.manejaCambio} >
                                    <option defaultValue hidden>Sexo</option>
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
                        <div className="col-12 col-md-6">
                            {this.props.ocupaAsociacion ?
                                <div className="mb-3 position-relative">
                                    <label htmlFor="asociacion" className="form-label">Asociación</label>
                                    <select className={this.state.errores.nacionalidad.length > 0 ? "form-select is-invalid":"form-select"} aria-label="asociacion" key="asociacion" name="id_organizacion" value={this.state.campos.id_organizacion} onChange={this.manejaCambioOrganizacion} >
                                        <option defaultValue hidden>Asociación</option>
                                        {this.state.asociaciones.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                                    </select>
                                    <div className="invalid-tooltip">
                                        {this.state.errores.nacionalidad}
                                    </div>
                                </div>
                                :
                                <></>}
                            {this.props.ocupaAsociacion || this.props.idOrganizacion ?
                                <div className="mb-3 position-relative">
                                    <label htmlFor="puesto" className="form-label">Puesto en Junta Directiva</label>
                                    <select className={this.state.errores.puesto.length > 0 ? "form-select is-invalid":"form-select"} aria-label="puesto" key="puesto" name="puesto" value={this.state.campos.puesto} onChange={this.manejaCambio}>
                                        <option defaultValue hidden>Puesto en Junta Directiva</option>
                                        {this.state.puestos.map((p,i) => <option key={i} value={p.id}>{p.nombre}</option>)}
                                    </select>
                                    
                                    <div className="invalid-tooltip">
                                        {this.state.errores.puesto}
                                    </div>
                                </div>
                                :<></>}
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
                    <div className="d-flex justify-content-end">
                        {this.props.cerrarModal ?
                        <div className="m-1">
                            <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.props.cerrarModal();this.reiniciarCampos()}}>Volver</button>
                        </div>:
                        <></>
                        }
                        <div className="m-1">
                            <button type="submit" className="btn btn-primary">{this.titulo}</button>
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