import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaTelefono from '../Usuario/AgregaTelefono';
import Telefonos from '../Usuario/Telefonos';
import Validacion from '../Utilidades/Validacion';

class OrganizacionForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.esUnionCantonal = props.esUnionCantonal;
        this.campos = props.campos;
        var campos = {
            nombre: "",
            territorio: "",
            domicilio: "",
            cedula: "",
            telefonos:[],
            id_organizacion:""
        };
        
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                territorio: props.campos.territorio ? props.campos.territorio : "",
                domicilio: props.campos.domicilio ? props.campos.domicilio : "",
                cedula: props.campos.cedula ? props.campos.cedula : "",
                telefonos:props.campos.telefonos ? props.campos.telefonos : [],
                id_organizacion:props.campos.id_organizacion ? props.campos.id_organizacion : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                hayError:false,
                nombre: "",
                territorio: "",
                domicilio: "",
                cedula: "",
                telefonos:"",
                id_organizacion:""
            },
            uniones: [],
            titulo: this.props.titulo,
            creado:false,
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            territorio: "requerido",
            domicilio: "requerido",
            cedula: "requerido",
            telefonos: "tiene-valores",
            id_organizacion: props.esUnionCantonal ? "" : "seleccionado"
        }, this);

        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.eliminarTelefono = this.eliminarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearOrganizacion = this.crearOrganizacion.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    // Falta reiniciar los otros campos
    reiniciarCampos(){
        this.setState({
            creado:false
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

    async crearOrganizacion(evento){
        evento.preventDefault();
        const datos = this.state;
        console.log(datos)

        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                var resp = await this.queriesGenerales.postear("/organizacion/crear", this.state.campos);
                console.log(resp);
                this.setState({
                    creado:true,
                    titulo:"¡Agregado con Éxito!",
                });
                this.avisaCreado(resp.data);
            }catch(error){
                console.log(error);
            }
        }
    }

    async avisaCreado(asociacion){
        await this.props.avisaCreado(asociacion);
    }

    async cargarUniones(){
        var uniones = this.state.uniones;
        const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/1", {});
        this.setState({
            uniones:uniones.concat(resp.data),
        });
    }

    componentDidMount(){
        if(!this.props.esUnionCantonal){
            this.cargarUniones();
        }
    }

    render(){
        return (
            <>
            <h2 className="modal-title text-center">{this.state.titulo}</h2>
            {!this.state.creado ?
            <form onSubmit={this.crearOrganizacion} noValidate>
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
                            <label htmlFor="territorio" className="form-label">Territorio</label>
                            <input type="text" className={this.state.errores.territorio.length > 0 ? "form-control is-invalid":"form-control"} key="territorio" name="territorio" value={this.state.campos.territorio} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.territorio}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="domicilio" className="form-label">Domicilio</label>
                            <input type="text" className={this.state.errores.domicilio.length > 0 ? "form-control is-invalid":"form-control"} key="domicilio" name="domicilio" value={this.state.campos.domicilio} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.domicilio}
                            </div>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="cedula" className="form-label">Cédula Jurídica</label>
                            <input type="text" className={this.state.errores.cedula.length > 0 ? "form-control is-invalid":"form-control"} key="cedula" name="cedula" value={this.state.campos.cedula} onChange={this.manejaCambio} />
                            <div className="invalid-tooltip">
                                {this.state.errores.cedula}
                            </div>
                        </div>
                    </div>
                    <div className="col">
                        {this.props.esUnionCantonal ? <></>:<div className="mb-3 position-relative">
                            <label htmlFor="unionCantonal" className="form-label">Unión Cantonal</label>
                            <select className={this.state.errores.id_organizacion.length > 0 ? "form-select is-invalid":"form-select"} aria-label="unionCantonal" key="unionCantonal" name="id_organizacion" value={this.state.campos.id_organizacion} onChange={this.manejaCambio} >
                                <option defaultValue value={""}>Unión Cantonal</option>
                                {this.state.uniones.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                            </select>
                            <div className="invalid-tooltip">
                                {this.state.errores.id_organizacion}
                            </div>
                        </div>}
                        <AgregaTelefono agregarTelefono={this.agregarTelefono} error={this.state.errores.telefonos} />
                        <Telefonos telefonos={this.state.campos.telefonos} eliminarTelefono={this.eliminarTelefono} />
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
            :<>
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

export default OrganizacionForm;