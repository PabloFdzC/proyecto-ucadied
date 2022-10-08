import React from 'react';
import ActividadForm from './ActividadForm';
import Tabla from '../Utilidades/Tabla.js'
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';

// Solo está creado hay que poner las cosas de adentro
class CalendarioActividades extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            actividades: [],
        }
        this.actividadesPedidas = false;
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarActividad = this.agregarActividad.bind(this);
    }

    // Hay que cambiarlo para pedir las actividades
    async cargarActividades(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultarTipo/1", {});
            this.setState({
                actividades:this.state.actividades.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }


    componentDidMount() {
        if(!this.actividadesPedidas){
            this.actividadesPedidas = true;
            this.cargarActividades();
        }
    }

    agregarActividad(){
        this.setState({
            usuario:{},
            muestra:true,
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }

    render(){
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Actividades</h1>
                    <button className="btn btn-primary" onClick={this.agregarActividad}><i className="lni lni-plus"></i>  Agregar actividad</button>
                </div>
                <div className="d-flex" style={{height:"inherit"}}>
                    calendario
                </div>
                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" scrollable>
                <Modal.Body>
                    <ActividadForm actividad={true} titulo={"Agregar Actividad"}  cerrarModal={()=>this.muestraModal(false)} />
                </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default CalendarioActividades;