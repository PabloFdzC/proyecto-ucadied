import React from 'react';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import JuntaDirectivaForm from './JuntaDirectivaForm.js';
import Tabla from '../Utilidades/Tabla.js'
import PuestoForm from './PuestoForm.js';
import QueriesGenerales from "../QueriesGenerales";

class JuntaDirectiva extends React.Component {
    constructor(props){
        super(props);
        this.juntaDirectivaId = props.juntaDirectivaId;
        this.id = props.id; // id de url
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            miembros:[],
            juntaDirectiva:{
                id:-1,
                n_miembros: -1,
                forma_elegir: ""
            }
        };
        this.titulos = [];
        this.juntaPedida = false;
        this.creaJunta = this.creaJunta.bind(this);
        this.avisaAgregado = this.avisaAgregado.bind(this);
    }

    async cargarJuntaDirectiva(){
        try{
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultar/"+this.id, {});
            console.log(resp);
            if(resp.data[0].id){
                this.setState({
                    juntaDirectiva:Object.assign({}, this.state.juntaDirectiva, {
                        id: resp.data[0].id,
                        n_miembros: resp.data[0].n_miembros,
                        forma_elegir: resp.data[0].forma_elegir,
                    }),
                });
            } else {
                this.setState({});
            }
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.juntaPedida){
            this.juntaPedida = true;
            this.cargarJuntaDirectiva();
        }
    }

    creaJunta(junta){
        this.setState({
            juntaDirectiva:Object.assign({}, this.state.juntaDirectiva, {
                id: junta.id,
                n_miembros: junta.n_miembros,
                forma_elegir: junta.forma_elegir,
            }),
        });
    }

    async cargarMiembros(){

    }

    async avisaAgregado(){
        await this.cargarMiembros();
    }

    render(){
        console.log(this.state.juntaDirectiva.id);
        console.log(this.juntaPedida);
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    console.log(usuario);
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (<>
                            {this.state.juntaDirectiva.id && this.state.juntaDirectiva.id < 0 && this.juntaPedida ?
                            <>
                            <div className="d-flex align-items-center justify-content-between m-3">
                                <h1>Junta Directiva</h1>
                            </div>
                            <div className="row" style={{height:"inherit"}}>
                                <div style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="m-4">
                                        <JuntaDirectivaForm idOrganizacion={this.id} creaJunta={this.creaJunta} />
                                    </div>
                                </div>
                            </div>
                            </>:
                            <>
                            <div className="d-flex align-items-center justify-content-between m-3">
                                <h1>Miembros de Junta Directiva</h1>
                                <div className="d-flex justify-content-end">
                                    <div className="m-1">
                                        <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#puestoModal"><i className="lni lni-plus"></i>  Agregar puesto</button>
                                    </div>
                                    <div className="m-1">
                                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#miembroModal"><i className="lni lni-plus"></i>  Agregar miembro</button>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="m-3">
                                    <h4>Cantidad de miembros: {this.state.juntaDirectiva.n_miembros}</h4>
                                    <h4>Forma de elegir:</h4>
                                    <p>{this.state.juntaDirectiva.forma_elegir}</p>
                                </div>
                            </div>
                            <div className="row" style={{height:"inherit"}}>
                                <div style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.miembros} style={{color:"#FFFFFF"}} />
                                </div>
                            </div>
                            </>}
                            <div className="modal fade" id="miembroModal" tabIndex="-1" aria-labelledby="modalAgregarMiembroJuntaDirectiva" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
                                        <h2 className="modal-title">Agregar Miembro de Junta Directiva</h2>
                                        <MiembroJuntaDirectivaForm idJunta={this.state.juntaDirectiva.id} avisaAgregado={this.avisaAgregado} />
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="modal fade" id="puestoModal" tabIndex="-1" aria-labelledby="modalAgregarPuesto" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
                                        <h2 className="modal-title">Agregar Puesto</h2>
                                        <PuestoForm idJunta={this.state.juntaDirectiva.id} />
                                    </div>
                                </div>
                                </div>
                            </div>
                            </>);
                    } else {
                        return <Navigate to='/iniciarSesion' replace={true}/>;
                    }
                }}
            </usuarioContexto.Consumer >
        );
    }
}

export default JuntaDirectiva;