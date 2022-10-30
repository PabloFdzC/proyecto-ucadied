import React from 'react';
import InmuebleForm from './InmuebleForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
//import Tabla from '../Utilidades/Tabla';
import Tabla from '../Utilidades/Table/Table.jsx';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
import {fechaAHoraAMPM} from '../Utilidades/ManejoHoras';
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
            indiceInmueble:null,
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
            {name:'Hora Apertura',selector:row=>fechaAHoraAMPM(new Date(row.inicio), true)},
            {name:'Hora Cierre',selector:row=>fechaAHoraAMPM(new Date(row.final), true)},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarInmueble = this.agregarInmueble.bind(this);
    }

    agregarInmueble(inmueble, indice){
        if(!inmueble) inmueble={};
        this.setState({
            indiceInmueble:indice,
            inmueble:inmueble,
            muestra:true,
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }

    async cargarInmuebles(){
        try{
            var inmuebles = this.state.inmuebles;
            const resp = await this.queriesGenerales.obtener("/inmueble/consultar", {id_organizacion:this.props.idOrganizacion});
            this.setState({
                inmuebles:inmuebles.concat(resp.data),
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

    async avisaCreado(inmueble){
        var inmuebles = this.state.inmuebles;
        if(!isNaN(this.state.indiceInmueble) && this.state.indiceInmueble){
            inmuebles[this.state.indiceInmueble] = inmueble;
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
                onClick:this.agregarInmueble,
                icon:"lni-pencil-alt",
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
                                    <button className="btn btn-primary" onClick={()=>this.agregarInmueble()}><i className="lni lni-plus"></i>  Agregar inmueble</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                       <Tabla titulos={this.titulos} titulosAnidados={this.titulosAnidados} valorAnidado={"horario"} datos={this.state.inmuebles} acciones={accionesTabla} />
                                    </div>
                                </div>
                                <Modal show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green">
                                <Modal.Body>
                                    <InmuebleForm idOrganizacion={this.props.idOrganizacion} avisaCreado={this.avisaCreado} campos={this.state.inmueble} cerrarModal={()=>this.muestraModal(false)} />
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