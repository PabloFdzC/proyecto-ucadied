import React from 'react';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import JuntaDirectivaForm from './JuntaDirectivaForm.js';
import Tabla from '../Utilidades/Tabla.js'
import PuestoForm from './PuestoForm.js';
import QueriesGenerales from "../QueriesGenerales";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import '../Estilos/Tabs.css';

class JuntaDirectiva extends React.Component {
    constructor(props){
        super(props);
        this.juntaDirectivaId = props.juntaDirectivaId;
        this.id = props.id; // id de url
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            miembros:[],
            puestos:[],
            juntaDirectiva:{
                id:-1,
                n_miembros: -1,
                forma_elegir: ""
            },
            key: "miembros"
        };
        this.titulos = [
            {llave:"nombre",valor:"Nombre"},
            {llave:"puesto",valor:"Puesto"},
            {llave:"funcion",valor:"Función"},
            {llave:"edita_pagina",valor:"Edita página"},
        ];
        this.titulosPuestos = [
            {llave:"nombre",valor:"Nombre"},
            {llave:"funcion",valor:"Función"},
            {llave:"edita_pagina",valor:"Edita página"},
        ];
        this.juntaPedida = false;
        this.creaJunta = this.creaJunta.bind(this);
        this.avisaAgregado = this.avisaAgregado.bind(this);
    }

    async cargarJuntaDirectiva(){
        try{
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultar/"+this.id, {});
            if(resp.data[0].id){
                this.setState({
                    juntaDirectiva:Object.assign({}, this.state.juntaDirectiva, {
                        id: resp.data[0].id,
                        n_miembros: resp.data[0].n_miembros,
                        forma_elegir: resp.data[0].forma_elegir,
                    }),
                });
                await this.cargarPuestos(resp.data[0].id);
            } else {
                this.setState({});
            }
        } catch(err){
            console.log(err);
            this.setState({});
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

    async cargarPuestos(idJunta){
        try{
            var puestos = this.state.puestos;
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultarPuestos/"+idJunta, {});
            this.setState({
                puestos:puestos.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    async cargarMiembros(){

    }

    async avisaAgregado(){
        await this.cargarMiembros();
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacionActual})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (<>
                            {this.state.juntaDirectiva.id && this.state.juntaDirectiva.id < 0 && this.juntaPedida ?
                            <>
                            <div className="d-flex align-items-center justify-content-between m-3">
                                <h1>Junta Directiva</h1>
                            </div>
                            <div className="d-flex" style={{height:"inherit"}}>
                                <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="m-4">
                                        <JuntaDirectivaForm idOrganizacion={this.id} creaJunta={this.creaJunta} />
                                    </div>
                                </div>
                            </div>
                            </>:
                            <>
                            <div className="d-flex align-items-center justify-content-between m-3">
                                <h1>Junta Directiva</h1>
                                <div className="d-flex justify-content-end">
                                    <div className="m-1">
                                        <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#puestoModal"><i className="lni lni-plus"></i>  Agregar puesto</button>
                                    </div>
                                    <div className="m-1">
                                        <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#miembroModal"><i className="lni lni-plus"></i>  Agregar miembro</button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="m-3">
                                    <h4>Cantidad máxima de miembros: {this.state.juntaDirectiva.n_miembros}</h4>
                                    <h4>Forma de elegir:</h4>
                                    <p>{this.state.juntaDirectiva.forma_elegir}</p>
                                </div>
                            </div>
                            <div className="d-flex" style={{height:"inherit"}}>
                                <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={(key) => this.setState({key})} className="mb-3">
                                    <Tab eventKey="miembros" title="Miembros">
                                        <Tabla titulos={this.titulos} datos={this.state.miembros} style={{color:"#FFFFFF"}} />
                                    </Tab>
                                    <Tab eventKey="puestos" title="Puestos">
                                        <Tabla titulos={this.titulosPuestos} datos={this.state.puestos} style={{color:"#FFFFFF"}} />
                                    </Tab>
                                </Tabs>
                                </div>
                            </div>
                            </>}
                            <div className="modal fade" id="miembroModal" tabIndex="-1" aria-labelledby="modalAgregarMiembroJuntaDirectiva" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
                                        <h2 className="modal-title">Agregar Miembro de Junta Directiva</h2>
                                        <MiembroJuntaDirectivaForm idJunta={this.state.juntaDirectiva.id} puestos={this.state.puestos} idOrganizacion={organizacionActual} avisaAgregado={this.avisaAgregado} />
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="modal fade" id="puestoModal" tabIndex="-1" aria-labelledby="modalAgregarPuesto" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
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