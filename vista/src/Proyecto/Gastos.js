import React from 'react';
import GastoForm from './GastoForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Table/Table';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';

import { buscarEnListaPorId } from '../Utilidades/ManejoLista';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

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
            muestraGasto:false,
            muestraEliminar:false,
            proyecto:{
                nombre:"",
            },
            Gasto:{},
            mensajeModal:"",
        }
        this.gastosPedidos = false;
        this.proyectoPedido = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Monto',selector:row=>row.monto,sortable:true},
            {name:'Fecha',selector:row=>row.fecha,sortable:true},
            {name:'Número de acta',selector:row=>row.numero_acta,sortable:true},
            {name:'Número de acuerdo',selector:row=>row.numero_acuerdo,sortable:true},
            {name:'Proveedor',selector:row=>row.proveedor,sortable:true},
            {name:'Número de factura',selector:row=>row.numero_factura,sortable:true},
            {name:'Comprobante de pago',selector:row=>row.numero_comprobante_pago,sortable:true},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.eliminarGasto = this.eliminarGasto.bind(this);
    }

    muestraModal(nombre, muestra, Gasto){
        if(!Gasto) Gasto={};
        this.setState({
            Gasto,
            ["muestra"+nombre]:muestra,
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
            const resp = await this.queriesGenerales.obtener("/proyecto/consultar", {id:this.props.idProyecto});
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
        if(!isNaN(this.state.Gasto.id) && this.state.Gasto.id){
            const indice = buscarEnListaPorId(gastos, this.state.Gasto.id);
            gastos[indice] = gasto;
            this.setState({
                gastos:gastos,
            });
            gasto.id = parseInt(gasto.id);
        } else {
            this.setState({
                gastos:gastos.concat(gasto),
            });
        }
    }

    async eliminarGasto(){
        try{
            const id = this.state.Gasto.id;
            await this.queriesGenerales.eliminar("/gasto/eliminar/"+id, {});
            const indice = buscarEnListaPorId(this.state.gastos, id);
            if(indice > -1){
                this.state.gastos.splice(indice, 1);
            }
            this.setState({
                mensajeModal: "¡Eliminado con éxito!",
            });
        } catch(err){
            console.log(err);
        }
    }

    render(){
        const accionesGastos = [
            {
                nombre:"Modificar",
                className:"btn-primary",
                onClick:(valor)=>this.muestraModal("Gasto",true, valor),
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
                                        <h1>{this.state.proyecto.nombre} - Gastos</h1>
                                        <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                                    </div>
                                    <button className="btn btn-primary" onClick={()=>this.muestraModal("Gasto",true)} ><i className="lni lni-plus"></i>  Agregar gasto</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.gastos} style={{color:"#FFFFFF"}} acciones={accionesGastos} />
                                    </div>
                                </div>
                                <Modal show={this.state.muestraGasto} onHide={()=>this.muestraModal("Gasto",false)} className="modal-green" centered>
                                <Modal.Body>
                                    <GastoForm idProyecto={this.props.idProyecto} avisaCreado={this.avisaCreado} cerrarModal={()=>this.muestraModal("Gasto",false)} campos={this.state.Gasto} />
                                </Modal.Body>
                                </Modal>
                                <Modal show={this.state.muestraEliminar} onHide={()=>this.muestraModal("Eliminar",false)} className="modal-green" centered>
                                <Modal.Body>
                                    {this.state.mensajeModal === "" ?
                                        <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar el gasto "+this.state.Gasto.nombre+" del proyecto?"} accion={this.eliminarGasto} cerrarModal={()=>this.muestraModal("Eliminar",false)} accionNombre="Eliminar" />
                                    :
                                        <>
                                            <h3 className="text-center">{this.state.mensajeModal}</h3>
                                            <div className="d-flex justify-content-end">
                                                <div className="m-1">
                                                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Eliminar",false)}>Volver</button>
                                                </div>
                                            </div>
                                        </>}
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