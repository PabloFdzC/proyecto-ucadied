import React from 'react';
import GastoForm from './GastoForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Table/Table';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';

/*
Recibe los props:
idProyecto: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class Gastos extends React.Component {

    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            gastos: [],
            muestraGF:false,
            proyecto:{
                nombre:"",
            },
        }
        this.gastosPedidos = false;
        this.proyectoPedido = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Monto',selector:row=>row.monto,sortable:true},
            {name:'Fecha',selector:row=>row.fecha,sortable:true},
            {name:'Número de acta',selector:row=>row.numero_acta,sortable:true},
            {name:'Número de acuerdo',selector:row=>row.numero_acuerdo,sortable:true},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
    }

    muestraModal(muestra){
        this.setState({
            muestraGF:muestra,
        });
    }

    async cargarGastos(){
        try{
            var gastos = this.state.gastos;
            const resp = await this.queriesGenerales.obtener("/gasto/consultar", {id_proyecto:this.props.idProyecto});
            this.setState({
                gastos:gastos.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    async cargarProyecto(){
        try{
            const resp = await this.queriesGenerales.obtener("/proyecto/consultar", {id_proyecto:this.props.idProyecto});
            console.log(resp);
            this.setState({
                proyecto:resp.data[0],
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar
    los gastos
    */
    componentDidMount() {
        document.title = "Gastos";
        if(!this.proyectoPedido){
            this.proyectoPedido = true;
            this.cargarProyecto();
        }
        if(!this.gastosPedidos){
            this.gastosPedidos = true;
            this.cargarGastos();
        }
    }

    async avisaCreado(gasto){
        var gastos = this.state.gastos;
        this.setState({
            gastos:gastos.concat(gasto),
        });
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <div>
                                        <h1>{this.state.proyecto.nombre} - Gastos</h1>
                                        <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                                    </div>
                                    <button className="btn btn-primary" onClick={()=>this.muestraModal(true)} ><i className="lni lni-plus"></i>  Agregar gasto</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.gastos} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <Modal show={this.state.muestraGF} onHide={()=>this.muestraModal(false)} className="modal-green">
                                <Modal.Body>
                                    <GastoForm idProyecto={this.props.idProyecto} avisaCreado={this.avisaCreado} cerrarModal={()=>this.muestraModal(false)} />
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

export default Gastos;