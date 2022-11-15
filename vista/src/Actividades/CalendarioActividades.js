import React from 'react';
import ActividadForm from './ActividadForm';
import Tabla from '../Utilidades/Tabla.js'
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
import manejarCambio from '../Utilidades/manejarCambio';

import {usuarioContexto} from '../usuarioContexto';
import { fechaAHoraAMPM } from '../Utilidades/ManejoHoras';

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import Accordion from 'react-bootstrap/Accordion';

import '../Estilos/Calendar.css';
import '../Estilos/Accordion.css';

/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class CalendarioActividades extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.calendario = React.createRef();
        this.state = {
            inmuebles: [],
            actividades: [],
            campos:{
                id_inmueble:"",
            },
            actividadesDia:[],
            muestraActividadForm:false,
            muestraActividadDia:false,
            fechaSeleccionada: "",
        }
        this.actividadesPedidas = false;
        this.muestraModal = this.muestraModal.bind(this);
        this.cargarActividades = this.cargarActividades.bind(this);
        this.manejaCambioInmueble = this.manejaCambioInmueble.bind(this);
        this.seleccionaDia = this.seleccionaDia.bind(this);
        this.fechaPuestaCalendario = this.fechaPuestaCalendario.bind(this);
        this.muestraModalActividadesDia = this.muestraModalActividadesDia.bind(this);
    }

    acomodarDatosCalendario(actividades){
        const actividadesCalendario = [];
        for(let i = 0; i < actividades.length; i++){
            for(let j = 0; j < actividades[i].reserva_inmuebles.length; j++){
                const horaI = new Date(actividades[i].reserva_inmuebles[j].inicio);
                const horaF = new Date(actividades[i].reserva_inmuebles[j].final);
                let mes = horaI.getUTCMonth();
                mes++;
                mes = mes < 10? "0"+mes:mes;
                let dia = horaI.getUTCDate();
                dia = dia < 10? "0"+dia:dia;
                const start = horaI.getUTCFullYear()+"-"+mes+"-"+dia;
                actividadesCalendario.push({
                    inicio: horaI,
                    final: horaF,
                    inicioBonito: fechaAHoraAMPM(horaI, true),
                    finalBonito: fechaAHoraAMPM(horaF, true),
                    id: actividades[i].reserva_inmuebles[j].id,
                    id_actividad: actividades[i].reserva_inmuebles[j].id_actividad,
                    id_inmueble: actividades[i].reserva_inmuebles[j].id_inmueble,
                    title:actividades[i].nombre ? actividades[i].nombre : "Actividad privada",
                    start:start,
                    nombre:actividades[i].nombre ? actividades[i].nombre : "Actividad privada",
                    persona_contacto: actividades[i].persona_contacto ? actividades[i].persona_contacto : "",
                    email: actividades[i].email ? actividades[i].email : "",
                    telefonos: actividades[i].telefonos ? actividades[i].telefonos : [],
                });
            }
        }
        actividadesCalendario.sort((a,b)=>{
            if (a.inicio < b.inicio) {
                return -1;
            }
            if (a.inicio > b.inicio) {
            return 1;
            }
            return 0;
        });
        return actividadesCalendario;
    }
    
    async cargarActividades(mes){
        try{
            const resp = await this.queriesGenerales.obtener("/actividad/consultar", {
                id_organizacion:this.props.idOrganizacion,
                id_inmueble:this.state.campos.id_inmueble,
                mes,
                habilitado:true,
            });
            this.setState({
                actividades:this.acomodarDatosCalendario(resp.data),
                mesActual: mes,
            });
        } catch(err){
            console.log(err);
        }   
    }

    async cargarInmuebles(){
        try{
            const resp = await this.queriesGenerales.obtener("/inmueble/consultar", {
                id_organizacion:this.props.idOrganizacion,
            });
            if(resp.data.length > 0){
                this.setState({
                    inmuebles:this.state.inmuebles.concat(resp.data),
                    campos:Object.assign({}, this.state.campos,{
                        id_inmueble:resp.data[0].id.toString(),
                    }),
                });
            }
        } catch(err){
            console.log(err);
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente y llama a cargar los inmuebles
    */
    async componentDidMount() {
        document.title = "Calendario Actividades";
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
        if(!this.inmueblesPedidos){
            this.inmueblesPedidos = true;
            this.cargarInmuebles();
        }
    }

    agregarActividad(){
        this.setState({
            usuario:{},
            muestraActividadForm:true,
        })
    }

    muestraModal(muestraActividadForm){
        this.setState({
            muestraActividadForm:muestraActividadForm,
        })
    }

    /*
    Se llama a la función manejarCambio que actualiza el
    estado con los valores de campos en el formulario
    */
    async manejaCambioInmueble(evento){
        // este await se ocupa porque sino va a agarrar
        // el inmueble anterior para pedir los datos
        await manejarCambio(evento, this);
        this.cargarActividades(this.state.mesActual);
    }

    async fechaPuestaCalendario(event){
        let mes;
        if(event.start.getDate() > 1)
            mes = event.start.getMonth()+2;
        else
            mes = event.start.getMonth()+1;
        this.cargarActividades(mes);
    }

    buscaActividades(fecha){
        const actividades = [];
        for(let i = 0; i < this.state.actividades.length; i++){
            // Aquí se revisan distintos porque en la interfaz obligatoriamente
            // se usa el local, esto para que el usuario pueda ver la fecha
            // bien donde sea que está, mientras que los datos del server
            // los tenemos como UTC
            if(this.state.actividades[i].inicio.getUTCDate() === fecha.getDate()){
                actividades.push(this.state.actividades[i]);
            }
        }
        return actividades;
    }

    muestraModalActividadesDia(actividades, muestra, fecha){
        this.setState({
            fechaSeleccionada:fecha ? fecha.toLocaleDateString() : "",
            muestraActividadDia: muestra,
            actividadesDia: actividades,
        });
    }

    seleccionaDia = (info) => {
        const fecha = info.date;
        const actividades = this.buscaActividades(fecha);
        this.muestraModalActividadesDia(actividades, true, fecha);
    };

    seleccionaEvento = (info) => {
        // Esto es para no cambiar el objeto que se encuentra en el state
        // actividades
        const fecha = new Date(info.event._def.extendedProps.inicio);
        // Esto es solo por si acaso ya que en la función buscaActividades se
        // revisa la fecha con getDate que puede ser distinta a la de UTC
        fecha.setDate(fecha.getUTCDate());
        const actividades = this.buscaActividades(fecha);
        this.muestraModalActividadesDia(actividades, true, fecha);
    };

    render(){
        return (
            <usuarioContexto.Consumer>
                {({organizacion})=>{
                return (<>
                    <div className="d-flex align-items-center justify-content-between m-3">
                        <div>
                            <h1>Actividades</h1>
                            <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                        </div>
                        <div className="mb-3 position-relative">
                            <label htmlFor="id_inmueble" className="form-label">Inmueble</label>
                            <select type="text" className="form-select" key="id_inmueble" name="id_inmueble" value={this.state.campos.id_inmueble} onChange={this.manejaCambioInmueble} >
                                {this.state.inmuebles.map((inmueble, i)=><option key={i} value={inmueble.id}>{inmueble.nombre}</option>)}
                            </select>
                        </div>
                        <button className="btn btn-primary" onClick={()=>this.muestraModal(true)}><i className="lni lni-plus"></i>  Agregar actividad</button>
                    </div>
                    <div className="d-flex" style={{height:"inherit",backgroundColor:"#137e31"}}>
                        <div style={{width:"100%"}}>
                            <FullCalendar
                            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            dateClick={this.seleccionaDia}
                            eventClick={this.seleccionaEvento}
                            locale={"es"}
                            events={this.state.actividades}
                            aspectRatio={2}
                            headerToolbar={{ left: 'prev', center: 'title', right: 'next'  }}
                            datesSet={this.fechaPuestaCalendario}
                        />
                        </div>
                    </div>
                    <Modal size="lg" show={this.state.muestraActividadForm} onHide={()=>this.muestraModal(false)} className="modal-green" centered>
                    <Modal.Body>
                        <ActividadForm actividad={true} cerrarModal={()=>this.muestraModal(false)} idInmueble={this.state.campos.id_inmueble} idOrganizacion={this.props.idOrganizacion} inmuebles={this.state.inmuebles} />
                    </Modal.Body>
                    </Modal>
                    <Modal size="lg" show={this.state.muestraActividadDia} onHide={()=>this.muestraModalActividadesDia([],false)} className="modal-green">
                    <Modal.Body>
                        <h2 className="text-center me-2">Actividades del {this.state.fechaSeleccionada}</h2>
                        <Accordion >
                        {this.state.actividadesDia.map((actividad, indice)=>
                            <Accordion.Item key={indice} eventKey={indice}>
                                <Accordion.Header>{actividad.nombre+" "+actividad.inicioBonito+"-"+actividad.finalBonito}</Accordion.Header>
                                {actividad.nombre !== "Actividad privada" ? 
                                <Accordion.Body>
                                    <div className="row">
                                        <div className="col">
                                            <h5>Persona de contacto</h5>
                                            <p>{actividad.persona_contacto}</p>
                                            <h5>Email</h5>
                                            <p>{actividad.email}</p>
                                        </div>
                                        <div className="col">
                                            <h5>Teléfonos</h5>
                                            {actividad.telefonos.map((t, j) => 
                                                <div className="m-2 p-2" key={"tel"+indice+"-"+j} style={{backgroundColor:"#160C28",borderRadius:"0.2em",color:"#fff"}}>
                                                    <p >{t}</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </Accordion.Body>
                             : <></>}
                            </Accordion.Item>
                        )}
                        </Accordion>
                    </Modal.Body>
                    </Modal>
                </>);
                }}
            </usuarioContexto.Consumer>
        );
    }
}

export default CalendarioActividades;