import React from 'react';
import GastoForm from './GastoForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Tabla';
import QueriesGenerales from "../QueriesGenerales";

class Gastos extends React.Component {

    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            gastos: []
        }
        this.gastosPedidos = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Monto',selector:row=>row.monto,sortable:true},
            {name:'Fecha',selector:row=>row.fecha,sortable:true},
            {name:'Número de acta',selector:row=>row.numero_acta,sortable:true},
            {name:'Número de acuerdo',selector:row=>row.numero_acuerdo,sortable:true},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
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

    componentDidMount() {
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
                {({usuario})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>{this.props.nombreProyecto} - Gastos</h1>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="lni lni-plus"></i>  Agregar gasto</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.gastos} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="modalAgregarUnion" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                        <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                            <div className="modal-body">
                                                <GastoForm idProyecto={this.props.idProyecto} avisaCreado={this.avisaCreado} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
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