import React from 'react';
import InmuebleForm from './InmuebleForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Table/Table.jsx';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
import {fechaAHoraAMPM} from '../Utilidades/ManejoHoras';
import { buscarEnListaPorId } from '../Utilidades/ManejoLista';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';
/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class Inmuebles extends React.Component {

    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            inmuebles: [],
            inmueble:{},
            muestraForm:false,
            muestraEliminar:false,
            mensajeModal:"",
        }
        this.inmueblesPedidos = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            ];
        this.titulosAnidados = [
            {name:'Día',selector:row=>{
                const dias = {
                    D:"Domingo",
                    L:"Lunes",
                    K:"Martes",
                    M:"Miércoles",
                    J:"Jueves",
                    V:"Viernes",
                    S:"Sábado",
                };
                return dias[row.dia]}},
            {name:'Hora Apertura',selector:row=>row.inicioBonito},
            {name:'Hora Cierre',selector:row=>row.finalBonito},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.eliminarInmueble = this.eliminarInmueble.bind(this);
    }

    muestraModal(nombre, muestra, inmueble){
        if(!inmueble) inmueble={};
        this.setState({
            inmueble,
            ["muestra"+nombre]: muestra
        })
    }

    cambiaDatosHorario(horario){
        for(let j = 0; j < horario.length; j++){
            let fechaI = new Date(horario[j].inicio);
            let fechaF = new Date(horario[j].final);
            horario[j].inicio = fechaAHoraAMPM(fechaI, true, false);
            horario[j].final = fechaAHoraAMPM(fechaF, true, false);
            horario[j].inicioBonito = fechaAHoraAMPM(fechaI, true, true);
            horario[j].finalBonito = fechaAHoraAMPM(fechaF, true, true);
        }
        return horario;
    }

    acomodarDatosInmuebles(datos){
        for(let i = 0; i < datos.length; i++){
            datos[i].horario = this.cambiaDatosHorario(datos[i].horario)
        }
        return datos;
    }

    async cargarInmuebles(){
        try{
            var inmuebles = this.state.inmuebles;
            const resp = await this.queriesGenerales.obtener("/inmueble/consultar", {id_organizacion:this.props.idOrganizacion});
            this.setState({
                inmuebles:this.acomodarDatosInmuebles(resp.data),
            });
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
        document.title = "Inmuebles";
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
        if(!this.inmueblesPedidos){
            this.inmueblesPedidos = true;
            this.cargarInmuebles();
        }
    }

    async eliminarInmueble(){
        try{
            const id = this.state.inmueble.id;
            await this.queriesGenerales.eliminar("/inmueble/eliminar/"+id, {});
            const indice = buscarEnListaPorId(this.state.inmuebles, id);
            if(indice > -1){
                this.state.inmuebles.splice(indice, 1);
            }
            this.setState({
                mensajeModal: "¡Eliminado con éxito!",
            });
        } catch(err){
            console.log(err);
        }
    }

    async avisaCreado(inmueble){
        inmueble.horario = this.cambiaDatosHorario(inmueble.horario);
        var inmuebles = this.state.inmuebles;
        const indice = buscarEnListaPorId(inmuebles, this.state.inmueble.id)
        if(indice !== -1){
            inmuebles[indice] = inmueble;
            this.setState({
                inmuebles:inmuebles,
            });
        } else {
            this.setState({
                inmuebles:inmuebles.concat(inmueble),
            });
        }
    }

    

    render(){
        const accionesTabla = [
            {
                nombre:"Modificar",
                className:"btn-primary",
                onClick:(valor)=>this.muestraModal("Form",true,valor),
                icon:"lni-pencil-alt",
            },
            {
                nombre:"Eliminar",
                className:"btn-danger",
                onClick:(valor)=>this.muestraModal("Eliminar",true, valor),
                icon:"lni-trash-can",
            },
        ];
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <div>
                                        <h1>Inmuebles</h1>
                                        <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                                    </div>
                                    <button className="btn btn-primary" onClick={()=>this.muestraModal("Form", true)}><i className="lni lni-plus"></i>  Agregar inmueble</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                       <Tabla titulos={this.titulos} titulosAnidados={this.titulosAnidados} valorAnidado={"horario"} datos={this.state.inmuebles} acciones={accionesTabla} />
                                    </div>
                                </div>
                                <Modal show={this.state.muestraForm} onHide={()=>this.muestraModal("Form",false)} className="modal-green" centered>
                                <Modal.Body>
                                    <InmuebleForm idOrganizacion={this.props.idOrganizacion} avisaCreado={this.avisaCreado} campos={this.state.inmueble} cerrarModal={()=>this.muestraModal("Form",false)} />
                                </Modal.Body>
                                </Modal>
                                <Modal show={this.state.muestraEliminar} onHide={()=>this.muestraModalEliminar("Puesto",false)} className="modal-green" centered>
                                <Modal.Body>
                                    {
                                    this.state.mensajeModal === "" ?
                                        <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar el inmueble "+this.state.inmueble.nombre+"?"} accion={this.eliminarInmueble} cerrarModal={()=>this.muestraModal("Eliminar",false)} accionNombre="Eliminar" />
                                    :
                                        <>
                                            <h3 className="text-center">{this.state.mensajeModal}</h3>
                                            <div className="d-flex justify-content-end">
                                                <div className="m-1">
                                                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Eliminar",false)}>Volver</button>
                                                </div>
                                            </div>
                                        </>   
                                    }
                                    
                                </Modal.Body>
                                </Modal>
                            </>
                        );
                    } else {
                        return <Navigate to='/iniciarSesion' replace={true}/>;
                    }
                }}
            </usuarioContexto.Consumer>
        );
    }
}

export default Inmuebles;