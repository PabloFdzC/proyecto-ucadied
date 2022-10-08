import React from 'react';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import Tabla from '../Utilidades/Table/Table.jsx';
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
            key: "miembros"
        };
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Puesto',selector:row=>row.puesto,sortable:true},
            {name:'Función',selector:row=>row.funcion,sortable:true},
            ];
        this.titulosPuestos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Función',selector:row=>row.funcion,sortable:true},
            {name:'Edita página',selector:row=>row.edita_pagina,sortable:true},
            {name:'Edita Junta Directiva',selector:row=>row.edita_junta,sortable:true},
            {name:'Edita proyectos',selector:row=>row.edita_proyecto,sortable:true},
            {name:'Edita actividades',selector:row=>row.edita_actividad,sortable:true},
            ];
        this.organizacionPedida = false;
        this.puestosPedidos = true;
        this.avisaAgregadoMiembro = this.avisaAgregadoMiembro.bind(this);
        this.agregaPuestos = this.agregaPuestos.bind(this);
    }

    

    async componentDidMount() {
        if(!this.organizacionPedida){
            this.organizacionPedida = true;
            try{
                console.log("PIDEEEEEEEEEEEEEEEEEEEEEEEEEEEE")
                await this.props.cargarOrganizacion(this.props.id);
                this.cargarPuestos(this.props.id);
                this.cargarMiembros(this.props.id);
            }catch(err){
                console.log(err);
            }
        }
    }

    async cargarPuestos(idOrganizacion){
        try{
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultarPuestos/"+idOrganizacion, {});
            this.agregaPuestos(resp.data);
        } catch(err){
            console.log(err);
        }
    }

    async cargarMiembros(idOrganizacion){
        try{
            var miembros = this.state.miembros;
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultarMiembros/"+idOrganizacion, {});
            var miembrosLista = [];
            for(let m of resp.data){
                var miembro = {
                    nombre:m.usuario.nombre,
                    puesto: m.puesto_jd.nombre,
                    funcion: m.puesto_jd.funcion,
                };
                miembrosLista.push(miembro);
            }
            this.setState({
                miembros:miembros.concat(miembrosLista),
            });
        } catch(err){
            console.log(err);
        }
    }

    async avisaAgregadoMiembro(miembroNuevo){
        var miembro = {
            nombre: miembroNuevo.label,
        };
        for(let p of this.state.puestos){
            if(p.id === miembroNuevo.id_puesto_jd){
                miembro.puesto = p.nombre;
                miembro.funcion = p.funcion;
            }
        }
        var miembros = this.state.miembros;
        this.setState({
            miembros:miembros.concat(miembro),
        });
    }

    agregaPuestos(puestosNuevos){
        var puestos = this.state.puestos;
        this.setState({
            puestos:puestos.concat(puestosNuevos),
        });
    }

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (<>
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
                                    <h4>Cantidad máxima de miembros: {organizacion.n_miembros_jd}</h4>
                                    <h4>Forma de elegir:</h4>
                                    <p>{organizacion.forma_elegir_jd}</p>
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
                            <div className="modal fade" id="miembroModal" tabIndex="-1" aria-labelledby="modalAgregarMiembroJuntaDirectiva" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
                                        <h2 className="modal-title">Agregar Miembro de Junta Directiva</h2>
                                        <MiembroJuntaDirectivaForm puestos={this.state.puestos} idOrganizacion={organizacion.id} avisaAgregado={this.avisaAgregadoMiembro} />
                                    </div>
                                </div>
                                </div>
                            </div>
                            <div className="modal fade" id="puestoModal" tabIndex="-1" aria-labelledby="modalAgregarPuesto" aria-hidden="true">
                                <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
                                        <PuestoForm idOrganizacion={organizacion.id} avisaAgregado={this.agregaPuestos} />
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