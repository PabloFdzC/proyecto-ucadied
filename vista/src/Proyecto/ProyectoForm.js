import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaElemento from '../Utilidades/AgregaElemento';
import Elementos from '../Utilidades/Elementos';
import Validacion from '../Utilidades/Validacion';
import Toast from 'react-bootstrap/Toast';

class OrganizacionForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.esUnionCantonal = props.esUnionCantonal;
        this.campos = props.campos ? props.campos : {};
        var campos = {
            nombre: this.campos.nombre ? this.campos.nombre : "",
            presupuesto: this.campos.presupuesto ? this.campos.presupuesto : "",
            inicio: this.campos.inicio ? this.campos.inicio : "",
            cierre: this.campos.cierre ? this.campos.cierre : "",
            usuarios:this.campos.usuarios ? this.campos.usuarios : [],
            id_organizacion:this.props.idOrganizacion
        };
        this.titulo = props.campos ? "Modificar Proyecto" : "Agregar Proyecto";
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                nombre: "",
                presupuesto: "",
                inicio: "",
                cierre: "",
                usuarios:"",
            },
            usuarios: [],
            titulo: this.titulo,
            creado:false,
            muestraMensajeError:false,
            mensajeError:"",
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            presupuesto: "requerido",
            inicio: "requerido",
            cierre: "requerido",
            usuarios: "tiene-valores",
        }, this);

        
        this.usuariosPedidos = false;
        this.agregarEncargado = this.agregarEncargado.bind(this);
        this.eliminarEncargado = this.eliminarEncargado.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
        this.crearProyecto = this.crearProyecto.bind(this);
    }

    /*
    reiniciarCampos devuelve los campos del formulario
    a su valor inicial
     */
    reiniciarCampos(){
        this.setState({
            titulo: this.titulo,
            creado:false,
            campos: Object.assign({},this.state.campos, {
                nombre: "",
                presupuesto: "",
                inicio: "",
                cierre: "",
                usuarios:[],
            })
        });
    }

    agregarEncargado(encargado){
        if(!this.state.errores.hayError){
            let usuarios = this.state.campos.usuarios.concat(encargado);
            this.setState({
                campos: Object.assign({},this.state.campos, {
                    usuarios:usuarios
                }),
                errores: Object.assign({}, this.state.errores, {
                    usuarios: "",
                })
            });
        }
        return !this.state.errores.hayError;
    }

    eliminarEncargado(indice, encargado){
        if (indice > -1){
            this.state.campos.usuarios.splice(indice, 1);
            this.setState({});
            
        }
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearProyecto(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                var campos = {
                    nombre: this.state.campos.nombre,
                    presupuesto: this.state.campos.presupuesto,
                    inicio: this.state.campos.inicio,
                    cierre: this.state.campos.cierre,
                    id_organizacion:this.props.idOrganizacion
                };
                var encargados = [];
                var usuarios = [];
                for(let e of this.state.campos.usuarios){
                    encargados.push(e.value);
                    usuarios.push({id:e.value,nombre:e.label});
                }
                campos.encargados = encargados;
                var resp = await this.queriesGenerales.postear("/proyecto/crear", campos);
                this.setState({
                    creado:true,
                    titulo:"¡Agregado con Éxito!",
                });
                var datos = resp.data;
                datos.usuarios = usuarios;
                this.props.avisaCreado(datos);
            }catch(error){
                console.log(error);
            }
        }
    }


    async cargarUsuarios(idOrganizacion){
        try{
            var usuarios = this.state.usuarios;
            const resp = await this.queriesGenerales.obtener("/usuario/consultar", {id_organizacion:idOrganizacion});
            var usuariosLista = [];
            for(let u of resp.data){
                var usuario = {
                    label:u.nombre,
                    value: u.id,
                };
                usuariosLista.push(usuario);
            }
            this.setState({
                usuarios:usuarios.concat(usuariosLista),
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount(){
        if(!this.usuariosPedidos){
            this.cargarUsuarios(this.props.idOrganizacion);
        }
    }

    render(){
        return (
            <>
            <h2 className="modal-title text-center">{this.state.titulo}</h2>
            {!this.state.creado ?
            <form onSubmit={this.crearProyecto} noValidate>
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
                            <label htmlFor="presupuesto" className="form-label">Presupuesto</label>
                            <input type="text" className={this.state.errores.presupuesto.length > 0 ? "form-control is-invalid":"form-control"} key="presupuesto" name="presupuesto" value={this.state.campos.presupuesto} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.presupuesto}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="inicio" className="form-label">Fecha de inicio</label>
                            <input type="date" className={this.state.errores.inicio.length > 0 ? "form-control is-invalid":"form-control"} key="inicio" name="inicio" value={this.state.campos.inicio} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.inicio}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="cierre" className="form-label">Fecha de cierre</label>
                            <input type="date" className={this.state.errores.cierre.length > 0 ? "form-control is-invalid":"form-control"} key="cierre" name="cierre" value={this.state.campos.cierre} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.cierre}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        <AgregaElemento titulo="Encargados" agregarElemento={this.agregarEncargado} error={this.state.errores.usuarios} opciones={this.state.usuarios} />
                        <Elementos conId={true} elementos={this.state.campos.usuarios} eliminarElemento={this.eliminarEncargado} />
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
                        <button type="submit" className="btn btn-primary">Agregar</button>
                    </div>
                </div>
                <div style={{position:"fixed", right:0, bottom:0}}>
                    <Toast bg="danger" onClose={() => this.setState({muestraMensajeError:false,mensajeError:""})} show={this.state.muestraMensajeError} delay={4000} autohide>
                    <Toast.Header>
                        <strong className="me-auto">Error</strong>
                    </Toast.Header>
                    <Toast.Body>{this.state.mensajeError}</Toast.Body>
                    </Toast>
                </div>
            </form>
            :<>
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                    <button type="button" className="btn btn-primary" aria-label="Agregar otro" onClick={this.reiniciarCampos}>Agregar otro</button>
                    </div>
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

export default OrganizacionForm;