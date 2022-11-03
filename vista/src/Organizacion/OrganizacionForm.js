import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaElemento from '../Utilidades/AgregaElemento';
import Elementos from '../Utilidades/Elementos';
import Validacion from '../Utilidades/Validacion';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import "../Estilos/Pills.css";
import Tabla from '../Utilidades/Tabla';
import PuestoForm from './PuestoForm';
import Toast from 'react-bootstrap/Toast';

/*
Recibe los props:
titulo: String para indicar si es asociación o unión
esUnionCantonal: Booleano para saber si es unión cantonal y no cargar
    la lista se asocaiciones
campos: Objeto con la forma de los campos (es opcional porque solo se ocupa
    si se va a usar el formulario para editar la organización)
avisaCreado: Función que permite enviar la información del formulario
    al componente que sea el padre del componente actual (o sea este),
    se usa para actualizar la tabla con la información que se agrega
    cuando se envía el formulario
ingresaJunta: Booleano para saber si el formulario debe mostrar la
    parte de ingresar junta directiva
cerrarModal: Función para que se cierre el modal que contiene al formulario
    entonces solo si se pone en un modal es necesaria
*/
class OrganizacionForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos ? props.campos : {};
        this.unionesCargadas = false;
        this.accion = Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar";
        var campos = {
            nombre: this.campos.nombre ? this.campos.nombre : "",
            territorio: this.campos.territorio ? this.campos.territorio : "",
            domicilio: this.campos.domicilio ? this.campos.domicilio : "",
            cedula: this.campos.cedula ? this.campos.cedula : "",
            telefonos:this.campos.telefonos ? this.campos.telefonos : [],
            email:this.campos.email ? this.campos.email : "",
            id_organizacion:this.campos.id_organizacion ? this.campos.id_organizacion : "",
            puestos: [],
        };


        this.state = {
            key: 'Organización',
            campos:campos,
            errores: {
                hayError:false,
                nombre: "",
                territorio: "",
                domicilio: "",
                cedula: "",
                telefonos:"",
                email:"",
                id_organizacion:"",
                puestos:[],
            },
            puestosError:false,
            uniones: [],
            titulo: this.accion+ " " +this.props.titulo,
            creado:false,
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            territorio: "requerido",
            domicilio: "requerido",
            cedula: "requerido|numeros",
            telefonos: "tiene-valores",
            email: "requerido",
            puestos: props.ingresaJunta ? "tiene-valores" : "",
            id_organizacion: props.esUnionCantonal ? "" : "seleccionado",
        }, this);
        // Es necesario poner dos validaciones para el teléfono porque
        // una valida cuando se envía la información y otra cuando se
        // agrega más de 1 teléfono
        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.titulosPuestos = [
            {llave:"nombre",valor:"Nombre"},
            // {llave:"funcion",valor:"Función"},
            // {llave:"edita_pagina",valor:"Edita página"},
            // {llave:"edita_junta",valor:"Edita Junta Directiva"},
            // {llave:"edita_proyecto",valor:"Edita proyectos"},
            // {llave:"edita_actividad",valor:"Edita actividades"},
        ];

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.eliminarTelefono = this.eliminarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.enviarOrganizacion = this.enviarOrganizacion.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
        this.agregaPuesto = this.agregaPuesto.bind(this);
    }

    /*
    Como dice la función simplemente vuelve al estado inicial
    el form
    */
    reiniciarCampos(){
        this.setState({
            titulo: this.accion+ " " +this.props.titulo,
            creado:false,
            campos: Object.assign({},this.state.campos, {
                nombre: "",
                territorio: "",
                domicilio: "",
                cedula: "",
                telefonos:[],
                id_organizacion:"",
                puestos:[],
            })
        });
    }

    /*
    La función agregarTelefono se pasa al componente
    AgregaElemento para que le indique al formulario que
    se agregó, en este caso, un teléfono entonces se
    actuliza el estado que tiene la lista de teléfonos
    */
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

    /*
    La función eliminarTelefono se pasa al componente
    AgregaElemento para que le indique al formulario que
    se eliminó, en este caso, un teléfono entonces se
    actuliza el estado que tiene la lista de teléfonos
    */
    eliminarTelefono(indice,telefono){
        if (indice > -1){
            this.state.campos.telefonos.splice(indice, 1);
            this.setState({});
        }
    }

    /*
    Se llama a la función manejarCambio que actualiza el
    estado con los valores de campos en el formulario
    */
    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    /*
    Esta es la función que envía la información del formulario
    a la base de datos
    */
    async enviarOrganizacion(evento){
        // Es necesario prevenir que lo envíe como lo hace
        // html
        evento.preventDefault();
        // Validar campos cambia el estado de los errores
        // entonces con solo llamar a la función se
        // puede ver si hay un error revisando el estado
        // de OrganizacionForm (el componente de este archivo)
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                let campos = {
                    nombre: this.state.campos.nombre,
                    territorio: this.state.campos.territorio,
                    domicilio: this.state.campos.domicilio,
                    cedula: this.state.campos.cedula,
                    telefonos:this.state.campos.telefonos,
                    email:this.state.campos.email,
                    id_organizacion:this.state.campos.id_organizacion,
                    puestos: this.state.puestos,
                };
                campos.email = campos.email + "@ucadied.org";
                var mensajeExito = "¡Agregado con éxito!";
                var resp;
                if(this.accion === "Agregar"){
                    resp = await this.queriesGenerales.postear("/organizacion/crear", campos);
                } else {
                    resp = await this.queriesGenerales.modificar("/organizacion/modificar/"+this.campos.id, campos);
                    mensajeExito = "¡Modificado con éxito!";
                }
                this.setState({
                    creado:true,
                    titulo:mensajeExito,
                });
                if(this.accion === "Agregar")
                    this.props.avisaCreado(resp.data);
                else{
                    campos.id = this.campos.id;
                    this.props.avisaCreado(campos);
                }
            }catch(error){
                console.log(error);
            }
        } else {
            if(this.state.errores.nombre.length !== 0 || this.state.errores.territorio.length !== 0 ||
                this.state.errores.domicilio.length !== 0 || this.state.errores.cedula.length !== 0 ||
                this.state.errores.telefonos.length !== 0 || this.state.errores.email.length !== 0 ||
                this.state.errores.id_organizacion.length !== 0){
                this.setState({
                    key:"Organización"
                });
            } else if(this.state.errores.puestos.length !== 0){
                this.setState({
                    key:"JuntaDirectiva",
                    puestosError: this.state.errores.puestos.length !== 0,
                });

            }
        }
    }
    /*
    Se usa para actualizar la tabla con la información que se agrega
    cuando se envía el formulario, para ello llama a la función que
    se pasó como prop
    */
    async avisaCreado(asociacion){
        await this.props.avisaCreado(asociacion);
    }

    /*
    Solo es necesario llamar la función cargarUniones si se quiere
    llenar el combobox (en html se llama select) para poder seleccionar
    la unión a la que pertenece la asociación
    */
    async cargarUniones(){
        var uniones = this.state.uniones;
        const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/1", {});
        this.setState({
            uniones:uniones.concat(resp.data),
        });
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar
    las uniones cantonales
    */
    componentDidMount(){
        if(!this.props.esUnionCantonal && !this.unionesCargadas){
            this.unionesCargadas = true;
            this.cargarUniones();
        }
    }

    agregaPuesto(puesto){
        let puestos = this.state.campos.puestos.concat(puesto);
        this.setState({
            campos: Object.assign({},this.state.campos, {
                puestos:puestos
            })
        });
    }

    render(){
        /*
        Dentro del return está {!this.state.creado ?}
        que si se creó la organización muestra un mensaje
        de creado con éxito, sino muestra el formulario
        */
        return (
            <>
            <h2 className="modal-title text-center">{this.state.titulo}</h2>
            {!this.state.creado ?
            <form onSubmit={this.enviarOrganizacion} noValidate>
                <Tab.Container id="left-tabs-example" activeKey={this.state.key} onSelect={(key) => this.setState({key})}>
                    {this.props.ingresaJunta ? 
                        <Row>
                            <Nav variant="pills" className="justify-content-center">
                            <Nav.Item>
                                <Nav.Link eventKey="Organización">{this.props.titulo}</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="JuntaDirectiva">Junta Directiva</Nav.Link>
                            </Nav.Item>
                            </Nav>
                        </Row> : <></>
                    }
                    <Row>
                        <Tab.Content>
                        <Tab.Pane eventKey="Organización">
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
                                <div className="col-12 col-md-6">
                                    {this.props.esUnionCantonal ? <></>:<div className="mb-3 position-relative">
                                        <label htmlFor="unionCantonal" className="form-label">Unión Cantonal</label>
                                        <select className={this.state.errores.id_organizacion.length > 0 ? "form-select is-invalid":"form-select"} aria-label="unionCantonal" key="unionCantonal" name="id_organizacion" value={this.state.campos.id_organizacion} onChange={this.manejaCambio} >
                                            <option defaultValue hidden value={""}>Unión Cantonal</option>
                                            {this.state.uniones.map((u,i) => <option key={i} value={u.id}>{u.nombre}</option>)}
                                        </select>
                                        <div className="invalid-tooltip">
                                            {this.state.errores.id_organizacion}
                                        </div>
                                    </div>}
                                    <div className="mb-3 position-relative">
                                        <label htmlFor="email" className="form-label">Email</label>
                                        <div className="input-group mb-3">
                                            <input type="text" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} onChange={this.manejaCambio} aria-label="email" aria-describedby="email" />
                                            <span className="input-group-text" id="email">@ucadied.org</span>
                                            <div className="invalid-tooltip">
                                                {this.state.errores.email}
                                            </div>
                                        </div>
                                    </div>
                                    <AgregaElemento titulo="Teléfonos" agregarElemento={this.agregarTelefono} error={this.state.errores.telefonos} />
                                    <Elementos elementos={this.state.campos.telefonos} eliminarElemento={this.eliminarTelefono} />
                                </div>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="JuntaDirectiva">
                            <div className="container">
                                <div className="row">
                                    <div className="col-12 col-md-6">
                                        <h4>Agregar Puesto</h4>
                                        <PuestoForm soloCampos={true} agregaPuesto={this.agregaPuesto} />
                                    </div>
                                    <div className="col-12 col-md-6">
                                    <h4>Puestos</h4>
                                        <div style={{overflowX:"scroll",overflowY:"auto"}}>
                                            <Tabla titulos={this.titulosPuestos} datos={this.state.campos.puestos} style={{color:"#FFFFFF"}} />
                                        </div>
                                        <div className="d-flex justify-content-end">
                                            <div style={{position:"fixed"}}>
                                                <Toast bg="danger" onClose={() => this.setState({puestosError:false})} show={this.state.puestosError} delay={4000} autohide>
                                                <Toast.Header>
                                                    <strong className="me-auto">Error</strong>
                                                </Toast.Header>
                                                <Toast.Body>Se debe agregar por lo menos 1 puesto.</Toast.Body>
                                                </Toast>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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
            </form>
            :<>
                <div className="d-flex justify-content-end">
                    {this.props.esUnionCantonal ?
                    <></>:
                    <div className="m-1">
                        <button type="button" className="btn btn-primary" aria-label="Agregar otra" onClick={this.reiniciarCampos}>Agregar otra</button>
                    </div>}
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