import React from 'react';
import InmuebleForm from './InmuebleForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Tabla';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
/*
Recibe los props:
id: Número entero que es el id de la organización en la que se
    encuentra actualmente
 */
class Inmuebles extends React.Component {

    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            inmuebles: [],
            inmueble:{},
        }
        this.inmueblesPedidos = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Horario',selector:row=>row.horario,sortable:true},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarInmueble = this.agregarInmueble.bind(this);
    }

    agregarInmueble(){
        this.setState({
            inmueble:{},
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
            const resp = await this.queriesGenerales.obtener("/inmueble/consultar", {id_organizacion:this.props.id});
            this.setState({
                inmuebles:inmuebles.concat(resp.data),
            });
            console.log(resp.data);
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.inmueblesPedidos){
            this.inmueblesPedidos = true;
            this.cargarInmuebles();
        }
    }

    async avisaCreado(inmueble){
        var inmuebles = this.state.inmuebles;
        this.setState({
            inmuebles:inmuebles.concat(inmueble),
        });
    }

    

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Inmuebles</h1>
                                    <button className="btn btn-primary" onClick={this.agregarInmueble}><i className="lni lni-plus"></i>  Agregar inmueble</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.inmuebles} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <Modal show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green">
                                <Modal.Body>
                                    <InmuebleForm idOrganizacion={this.props.id} avisaCreado={this.avisaCreado} campos={this.state.inmueble} cerrarModal={()=>this.muestraModal(false)} />
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