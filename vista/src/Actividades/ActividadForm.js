import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaElemento from '../Utilidades/AgregaElemento';
import Elementos from '../Utilidades/Elementos';
import Validacion from '../Utilidades/Validacion';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import listaHoras from '../Utilidades/listaHoras';
import Select from 'react-select';
import {fechaAHoraAMPM, horaAFecha,partirStringHora} from '../Utilidades/ManejoHoras';

import Reaptcha from 'reaptcha';

import {stringAFecha, fechaAString} from '../Utilidades/ManejoFechas';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';

/*
Recibe los props:
idOrganizacion: número entero con el id de la organización
    en la que se creará la actividad
idInmueble: string con número entero del inmueble seleccionado
    por el usuario
inmuebles: lista con objetos de inmueble con la forma
    {
        id: número entero,
        nombre: string,
        horario: lista con objetos de la
        forma {
            dia: una letra que indica día,
            inicio: string con fecha,
            final: string con fecha,
        },
    },
cerrarModal: función que permite cerrar el modal en
    el que se encuentra el formulario
 */
class ActividadForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.url = props.url;
        this.titulo = "Agregar Actividad";
        this.diasLetra = ["D","L","K","M","J","V","S"];
        this.horas = listaHoras();
        this.tipoInicial = "Pública";
        this.fechaHoy = fechaAString(new Date());
        var campos = {
            captcha:"",
            id_organizacion:props.idOrganizacion,
            nombre: "",
            tipo: this.tipoInicial,
            id_inmueble:props.idInmueble,
            persona_contacto: "",
            identificacion:"",
            email: "",
            telefonos: [],
            repeticion: this.diasLetra.map(()=>false),
            fechaInicio:this.fechaHoy,
            fechaFinal:this.fechaHoy,
            horaInicio:"",
            horaFinal:"",
        };
        this.state = {
            key:"Actividad",
            titulo: this.titulo,
            campos:campos,
            muestraMensajeError:false,
            mensajeError: "",
            diasPosibles:[],
            errores: {
                captcha:"",
                nombre: "",
                tipo: "",
                id_inmueble:"",
                persona_contacto: "",
                identificacion:"",
                email: "",
                telefonos: "",
                fechaInicio:"",
                fechaFinal:"",
                horaInicio:"",
                horaFinal:"",
            },
            creado:false,
            procesando:false,
        };
        // aquí se indica qué es lo que se quiere
        // validar en cada campo, se debe poner
        // el mismo nombre que se le puso en el
        // objeto del state de campos
        this.validacion = new Validacion({
            captcha:"captcha",
            nombre: "requerido",
            tipo: "seleccionado",
            id_inmueble:"seleccionado",
            persona_contacto: "requerido",
            identificacion:"requerido|numeros",
            email: "requerido|email",
            telefonos: "tiene-valores",
            fechaInicio:"requerido|fecha",
            fechaFinal:"requerido|fecha",
            horaInicio:"seleccionado",
            horaFinal:"seleccionado",
        }, this);

        // Es necesario poner dos validaciones para el teléfono porque
        // una valida cuando se envía la información y otra cuando se
        // agrega más de 1 teléfono
        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.eliminarTelefono = this.eliminarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearActividad = this.crearActividad.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
        this.volver = this.volver.bind(this);
        this.captchaVerificado = this.captchaVerificado.bind(this);
    }

    /*
    La función agregarTelefono se pasa al componente
    AgregaElemento para que le indique al formulario que
    se agregó, en este caso, un teléfono entonces se
    actuliza el estado que tiene la lista de teléfonos
    
    Parámetros:
    - telefono: string con número entero
    
    Salida: booleano que indica si hay un error
        al agregar el telefono
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
    actualiza el estado que tiene la lista de teléfonos
    
    Parámetros:
    - indice: número entero
    */
    eliminarTelefono(indice){
        if (indice > -1){
            this.state.campos.telefonos.splice(indice, 1);
            this.setState({});
        }
    }

    /*
    reiniciarCampos devuelve los campos del formulario
    a su valor inicial
     */
    reiniciarCampos(){
        this.setState({
            titulo: this.titulo,
            creado:false,
            procesando:false,
            key:"Actividad",
            campos: Object.assign({},this.state.campos, {
                id_organizacion:this.props.idOrganizacion,
                nombre: "",
                tipo: this.tipoInicial,
                id_inmueble:this.props.idInmueble,
                persona_contacto: "",
                email: "",
                telefonos: [],
                repeticion: this.diasLetra.map(()=>false),
                fechaInicio:this.fechaHoy,
                fechaFinal:this.fechaHoy,
                horaInicio:"",
                horaFinal:"",
            })
        });
    }

    /*
    Se llama a la función manejarCambio que actualiza el
    estado con los valores de campos en el formulario
    Parámetros:
    - evento: objeto del DOM o puede ser un objeto
        de la forma
        {
            target:{
                name:string con nombre que tiene el campo,
                type:string con el tipo de input que es,
                value:puede ser cualquiercosa con lo que
                    se deba llenar el input,
            }
        }
    */
    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    diasPosibles(dias, diasError){
        var posibles = [];
        for(let i = 0; i < dias.length; i++){
            let mete = true;
            for(let j = 0; j < diasError.length; j++){
                if(dias[i].inicio === diasError[j].inicio){
                    mete = false;
                    break;
                }
            }
            if(mete){
                posibles.push(dias[i]);
            }
        }
        this.setState({
            procesando:false,
            diasPosibles:posibles,
        });
    }

    /*
    obtenerDias devuelve una lista con las
    fechas listas para subirlas al serve
    
    Salida: lista de objetos con la forma
        {
            inicio: objeto Date,
            final: objeto Date
        }
     */
    obtenerDias(){
        if(this.state.diasPosibles.length > 0){
            return this.state.diasPosibles;
        }
        var dias = [];
        var fechaInicio = stringAFecha(this.state.campos.fechaInicio);
        var fechaFinal = stringAFecha(this.state.campos.fechaFinal);
        while(fechaInicio <= fechaFinal){
            if(this.state.campos.repeticion[fechaInicio.getUTCDay()]){
                let [horaI,minI] = partirStringHora(this.state.campos.horaInicio.value);
                let [horaF,minF] = partirStringHora(this.state.campos.horaFinal.value);
                let inicio = new Date(fechaInicio);
                let final = new Date(fechaInicio);
                inicio.setUTCHours(horaI, minI, 0, 0);
                final.setUTCHours(horaF, minF, 0, 0);
                dias.push({
                    inicio:inicio.toUTCString(),
                    final:final.toUTCString(),
                })
            }
            fechaInicio.setUTCDate(fechaInicio.getUTCDate()+1);
        }
        return dias;
    }

    

    /*
    crearActividad primero valida que los campos estén
    bien y luego envia los datos al server
     */
    async crearActividad(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        // Si no se encuentra errores en las fechas se revisa que la inicial
        // sea mayor o igual que la final
        if(this.state.errores.fechaInicio === "" && this.state.errores.fechaFinal === ""){
            let fechasErrores = this.validacion.fechaInicialFinalCorrectas(this.state.campos.fechaInicio,this.state.campos.fechaFinal, true);
            if(fechasErrores.inicio !== "" && fechasErrores.final !== ""){
                this.setState({
                    errores: Object.assign({},this.state.errores, {
                        hayError:true,
                        fechaInicio:fechasErrores.inicio,
                        fechaFinal:fechasErrores.final,
                    }),
                });    
            }
        }
        // Si no se encuentra errores en las horas se revisa que la inicial
        // sea mayor que la final
        if(this.state.errores.horaInicio === "" && this.state.errores.horaFinal === ""){
            var horasErrores = this.validacion.horaInicialFinalCorrectas(this.state.campos.horaInicio.value,this.state.campos.horaFinal.value);
            if(horasErrores.inicio !== "" && horasErrores.final !== ""){
                this.setState({
                    errores: Object.assign({},this.state.errores, {
                        hayError:true,
                        horaInicio:horasErrores.inicio,
                        horaFinal:horasErrores.final,
                    }),
                });
            }
        }
        if(!this.state.errores.hayError){
            var datos = {
                captcha:this.state.campos.captcha,
                id_organizacion: this.props.idOrganizacion,
                nombre: this.state.campos.nombre,
                tipo: this.state.campos.tipo,
                persona_contacto: this.state.campos.persona_contacto,
                email: this.state.campos.email,
                telefonos: this.state.campos.telefonos,
                id_inmueble:this.state.campos.id_inmueble,
            };
            datos.dias = this.obtenerDias();
            try{
                this.setState({
                    procesando:true,
                });
                const resp = await this.queriesGenerales.postear("/actividad/crear", datos);
                this.setState({
                    creado:true,
                    procesando:false,
                    titulo:"¡Agregada con éxito!",
                });
            }catch(error){
                console.log(error);
                if(error.response.data.errores.length === datos.dias.length){
                    this.setState({
                        procesando:false,
                        mensajeError:"No hay espacios disponibles en las fechas seleccionadas.",
                        muestraMensajeError:true,
                    });
                } else {
                    this.diasPosibles(datos.dias, error.response.data.errores);
                }
            }
        } else {
            if(this.state.errores.nombre.length !== 0 || this.state.errores.tipo.length !== 0 ||
                this.state.errores.id_inmueble.length !== 0 || this.state.errores.persona_contacto.length !== 0 ||
                this.state.errores.telefonos.length !== 0 || this.state.errores.email.length !== 0){
                this.setState({
                    key:"Actividad"
                });
            } else if(this.state.errores.fechaInicio.length !== 0 || this.state.errores.fechaFinal.length !== 0 ||
                this.state.errores.horaInicio.length !== 0 || this.state.errores.horaInicio.length !== 0 ||
                this.state.errores.captcha.length !== 0){
                this.setState({
                    key:"Fechas"
                });
            }
        }

    }



    /*
    manejaCambioRepeticion actualiza el valor que tienen los
    checkboxes (en la interfaz se ven como botónes)

    Entradas:
    - indice: número entero que indica cuál de los días
        se seleccionó
    - valor: checkbox del DOM
     */
    manejaCambioRepeticion(indice, checkbox){
        const objetivo = checkbox.target;
        const valor = objetivo.checked;
        let repeticion = [...this.state.campos.repeticion];
        repeticion[indice] = valor;
        this.setState({
            campos: Object.assign({}, this.state.campos, {
                repeticion: repeticion,
            }),
          });
    }

    volver(){
        this.props.cerrarModal();
        this.reiniciarCampos();
    }


    captchaVerificado(captcha){
        this.setState({
            campos: Object.assign({}, this.state.campos, {
                captcha,
            }),
        });
    }

    render(){
        // Esta primera parte nos permite mostrar
        // el horario que tenga el inmueble que el
        // usuario haya escogido
        var inmuebleSeleccionado;
        for(let i = 0; i < this.props.inmuebles.length; i++){
            // la comparación no se hace con === porque el de campos
            // es un string y el de inmuebles es un int
            if(this.state.campos.id_inmueble == this.props.inmuebles[i].id){
                inmuebleSeleccionado = this.props.inmuebles[i];
                break;
            }
        }
        const captcha =
        <div className="mb-3 position-relative">
            <Reaptcha
                onVerify={this.captchaVerificado}
                onExpired={()=>this.captchaVerificado("")}
                onError={()=>this.captchaVerificado("")}
                sitekey="6Leu-2kiAAAAAMHi78aFYa-E444kM55j7bRqQyMa" />
            <input className={this.state.errores.captcha.length > 0 ? "form-control is-invalid":"form-control"} style={{display:"none"}} />
            <div className="invalid-tooltip">
                {this.state.errores.captcha}
            </div>
        </div>;
        

        return (
            <>
            <h2 className="text-center">{this.state.titulo}</h2>
            {!this.state.creado ? 
                this.state.procesando ? 
                    <div className="d-flex justify-content-center">
                        <Spinner animation="border" role="Creando actividad" variant="light" />
                        <span>Creando actividad</span>
                    </div>
                :
                    this.state.diasPosibles.length > 0 ?
                        <form onSubmit={this.crearActividad} noValidate>
                            <h3 className="text-center">Solo se puede reservar los días</h3>
                            <div className="ps-2" style={{maxHeight:"150px",overflow:"scroll"}}>
                                {this.state.diasPosibles.map((valor, i)=>{
                                    let inicio = new Date(valor.inicio);
                                    let final = new Date(valor.final);
                                    return <p key={i}>{inicio.toLocaleDateString()} {fechaAHoraAMPM(inicio, true, true)}-{fechaAHoraAMPM(final, true, true)}</p>;
                                    })}
                            </div>
                            <h3 className="text-center">¿Desea agregar la actividad de todas formas?</h3>
                            {captcha}
                            <div className="d-flex justify-content-end">
                                <div className="m-1">
                                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.setState({diasPosibles:[]});}}>Volver</button>
                                </div>
                                <div className="m-1">
                                    <button type="submit" className="btn btn-primary">Agregar</button>
                                </div>
                            </div>
                        </form>
                    :
                        <form onSubmit={this.crearActividad} noValidate>
                            <Tab.Container id="left-tabs-example" activeKey={this.state.key} onSelect={(key) => this.setState({key})}>
                                <Row>
                                    <Nav variant="pills" className="justify-content-center">
                                    <Nav.Item>
                                        <Nav.Link eventKey="Actividad">Actividad</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="Fechas">Fechas</Nav.Link>
                                    </Nav.Item>
                                    </Nav>
                                </Row>
                                <Row>
                                    <Tab.Content>
                                    <Tab.Pane eventKey="Actividad">
                                    <div className="row">
                                        <div className="col-12 col-md-6">
                                            <div className="mb-3 position-relative">
                                                <label htmlFor="nombre" className="form-label">Nombre</label>
                                                <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre"  value={this.state.campos.nombre} onChange={this.manejaCambio} />
                                                <div className="invalid-tooltip">
                                                    {this.state.errores.nombre}
                                                </div>
                                            </div>
                                            
                                            <div className="mb-3 position-relative">
                                                <label htmlFor="tipo" className="form-label">Tipo</label>
                                                <select type="text" className={this.state.errores.tipo.length > 0 ? "form-select is-invalid":"form-select"} key="tipo" name="tipo" value={this.state.campos.tipo} onChange={this.manejaCambio} >
                                                    <option value="Pública">Pública</option>
                                                    <option value="Privada">Privada</option>
                                                </select>
                                                <div className="invalid-tooltip">
                                                    {this.state.errores.tipo}
                                                </div>
                                            </div>
                                            <div className="mb-3 position-relative">
                                                <label htmlFor="inmueble" className="form-label">Inmueble</label>
                                                <select type="text" className={this.state.errores.id_inmueble.length > 0 ? "form-select is-invalid":"form-select"} key="id_inmueble" name="id_inmueble" value={this.state.campos.id_inmueble} onChange={this.manejaCambio} >
                                                    {this.props.inmuebles.map((inmueble, i)=><option key={i} value={inmueble.id}>{inmueble.nombre}</option>)}
                                                </select>
                                                <div className="invalid-tooltip">
                                                    {this.state.errores.id_inmueble}
                                                </div>
                                            </div>
                                            <div className="mb-3 position-relative">
                                                <label htmlFor="persona_contacto" className="form-label">Persona de contacto</label>
                                                <input type="text" className={this.state.errores.persona_contacto.length > 0 ? "form-control is-invalid":"form-control"} key="persona_contacto" name="persona_contacto" value={this.state.campos.persona_contacto} onChange={this.manejaCambio} />
                                                <div className="invalid-tooltip">
                                                    {this.state.errores.persona_contacto}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-12 col-md-6">
                                            <div className="mb-3 position-relative">
                                                <label htmlFor="identificacion" className="form-label">Identificación o DIMEX</label>
                                                <input type="text" className={this.state.errores.identificacion.length > 0 ? "form-control is-invalid":"form-control"} key="identificacion" name="identificacion" value={this.state.campos.identificacion} onChange={this.manejaCambio} />
                                                <div className="invalid-tooltip">
                                                    {this.state.errores.identificacion}
                                                </div>
                                            </div>
                                            <div className="mb-3 position-relative">
                                                <label htmlFor="email" className="form-label">Email</label>
                                                <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} onChange={this.manejaCambio} />
                                                <div className="invalid-tooltip">
                                                    {this.state.errores.email}
                                                </div>
                                            </div>
                                            <AgregaElemento titulo="Teléfonos" agregarElemento={this.agregarTelefono} error={this.state.errores.telefonos} />
                                            <Elementos elementos={this.state.campos.telefonos} eliminarElemento={this.eliminarTelefono} />
                                        </div>
                                    </div>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="Fechas">
                                        <div className="container">
                                            <div className="row">
                                                <h5 className="text-center">Horario de {inmuebleSeleccionado.nombre}</h5>
                                                {inmuebleSeleccionado.horario.map((horario,i)=>
                                                <div className="input-group mb-3" key={i} style={{width:"auto"}}>
                                                    <span className="input-group-text bg-info" id={horario.dia}>{horario.dia}</span>
                                                    <label  className="form-control bg-info" aria-describedby={horario.dia}>{fechaAHoraAMPM(new Date(horario.inicio),true, true)}-{fechaAHoraAMPM(new Date(horario.final),true, true)}</label>
                                                </div>)}
                                            </div>
                                            <div className="row">
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-3 position-relative">
                                                        <label htmlFor="fechaInicio" className="form-label">Fecha inicio</label>
                                                        <input type="date" className={this.state.errores.fechaInicio.length > 0 ? "form-control is-invalid":"form-control"} key="fechaInicio" name="fechaInicio"  value={this.state.campos.fechaInicio} onChange={this.manejaCambio} min={this.fechaHoy} />
                                                        <div className="invalid-tooltip">
                                                            {this.state.errores.fechaInicio}
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 position-relative">
                                                        <label htmlFor="fechaFinal" className="form-label">Fecha final</label>
                                                        <input type="date" className={this.state.errores.fechaFinal.length > 0 ? "form-control is-invalid":"form-control"} key="fechaFinal" name="fechaFinal"  value={this.state.campos.fechaFinal} onChange={this.manejaCambio} min={this.fechaHoy} />
                                                        <div className="invalid-tooltip">
                                                            {this.state.errores.fechaFinal}
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 position-relative">
                                                        <label htmlFor="repeticion" className="form-label">Repetición cada</label>
                                                        <div className="btn-group" role="group" aria-label="Basic checkbox toggle button group" style={{width:"100%"}}>
                                                        {this.diasLetra.map((valor,i)=>
                                                            <React.Fragment key={"c-"+i}>
                                                            <input type="checkbox" className="btn-check" id={"btn-check-"+i} key={"i-"+i} checked={this.state.campos.repeticion[i]} onChange={(checkbox)=>this.manejaCambioRepeticion(i, checkbox)} />
                                                            <label className="btn btn-outline-info" htmlFor={"btn-check-"+i} key={"l-"+i}>{valor}</label>
                                                            </React.Fragment>
                                                        )}
                                                        </div>
                                                        <div className="invalid-tooltip">
                                                            {this.state.errores.repeticion}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-12 col-md-6">
                                                    <div className="mb-3 position-relative">
                                                        <label htmlFor="horaInicio" className="form-label">Hora inicio</label>
                                                        <div className={this.state.errores.horaInicio.length > 0 ? "p-0 form-control is-invalid":"p-0 form-control"}>
                                                            <Select 
                                                            isClearable
                                                            key="horaInicio" name="horaInicio" value={this.state.campos.horaInicio} onChange={(opcion)=>this.manejaCambio({target:{name:"horaInicio",type:"select",value:opcion}})}
                                                            options={this.horas}
                                                            />
                                                        </div>
                                                        <div className="invalid-tooltip">
                                                            {this.state.errores.horaInicio}
                                                        </div>
                                                    </div>
                                                    <div className="mb-3 position-relative">
                                                        <label htmlFor="horaFinal" className="form-label">Hora final</label>
                                                        <div className={this.state.errores.horaFinal.length > 0 ? "p-0 form-control is-invalid":"p-0 form-control"}>
                                                            <Select 
                                                            isClearable
                                                            key="horaFinal" name="horaFinal" value={this.state.campos.horaFinal} onChange={(opcion)=>this.manejaCambio({target:{name:"horaFinal",type:"select",value:opcion}})}
                                                            options={this.horas}
                                                            />
                                                        </div>
                                                        <div className="invalid-tooltip">
                                                            {this.state.errores.horaFinal}
                                                        </div>
                                                    </div>
                                                    {captcha}
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
                                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={this.volver}>Volver</button>
                                </div>:
                                <></>
                                }
                                <div className="m-1">
                                    <button type="submit" className="btn btn-primary">Agregar</button>
                                </div>
                            </div>
                            <div className="d-flex justify-content-end">
                                <div style={{position:"fixed"}}>
                                    <Toast bg="danger" onClose={() => this.setState({muestraMensajeError:false,mensajeError:""})} show={this.state.muestraMensajeError} delay={4000} autohide>
                                    <Toast.Header>
                                        <strong className="me-auto">Error</strong>
                                    </Toast.Header>
                                    <Toast.Body>{this.state.mensajeError}</Toast.Body>
                                    </Toast>
                                </div>
                            </div>
                        </form>
            :
            <>
            <p className="text-center">Debe esperar a que la actividad sea habilitada por un administrador</p>
            <div className="d-flex justify-content-end">
                <div className="m-1">
                    <button type="button" className="btn btn-primary" aria-label="Agregar otra" onClick={this.reiniciarCampos}>Agregar otra</button>
                </div>
                {this.props.cerrarModal ?
                <div className="m-1">
                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={this.volver}>Volver</button>
                </div>:
                <></>
                }
            </div>
            </>}
            </>
        );
    }
}

export default ActividadForm;