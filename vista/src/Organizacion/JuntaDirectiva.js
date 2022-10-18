import React from 'react';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import Tabla from '../Utilidades/Table/Table.jsx';
import PuestoForm from './PuestoForm.js';
import QueriesGenerales from "../QueriesGenerales";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import '../Estilos/Tabs.css';
import UsuarioForm from '../Usuario/UsuarioForm';

class JuntaDirectiva extends React.Component {
    constructor(props){
        super(props);
        this.juntaDirectivaId = props.juntaDirectivaId;
        this.id = props.id; // id de url
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            miembros:[],
            puestos:[],
            key: "miembros",
            muestraMJDF:false,
            muestraPF:false,
            muestraUF:false,
        };
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Puesto',selector:row=>row.puesto,sortable:true},
            {name:'Función',selector:row=>row.funcion,sortable:true},
            ];
        this.titulosPuestos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Función',selector:row=>row.funcion,sortable:true},
            {name:'Edita página',selector:row=>row.edita_pagina ? "Sí":"No"},
            {name:'Edita Junta Directiva',selector:row=>row.edita_junta ? "Sí":"No"},
            {name:'Edita proyectos',selector:row=>row.edita_proyecto ? "Sí":"No"},
            {name:'Edita actividades',selector:row=>row.edita_actividad ? "Sí":"No"},
            ];
        this.organizacionPedida = false;
        this.puestosPedidos = true;
        this.avisaAgregadoMiembro = this.avisaAgregadoMiembro.bind(this);
        this.agregaPuestos = this.agregaPuestos.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.avisaCreadoMiembro = this.avisaCreadoMiembro.bind(this);
    }

    muestraModal(nombre,muestra){
        this.setState({
            [nombre]:muestra,
        });
    }
    

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente, llama a cargar los puestos
    y llama a cargar los miembros
    */
    async componentDidMount() {
        document.title = "Junta Directiva";
        if(!this.organizacionPedida){
            this.organizacionPedida = true;
            try{
                await this.props.cargarOrganizacion(this.props.idOrganizacion);
                this.cargarPuestos(this.props.idOrganizacion);
                this.cargarMiembros(this.props.idOrganizacion);
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

    avisaCreadoMiembro(miembroNuevo){
        var miembro = {
            nombre: miembroNuevo.nombre,
        };
        for(let p of this.state.puestos){
            if(p.id == miembroNuevo.puesto){
                miembro.puesto = p.nombre;
                miembro.funcion = p.funcion;
            }
        }
        var miembros = this.state.miembros;
        this.setState({
            miembros:miembros.concat(miembro),
        });
    }
    
    async avisaAgregadoMiembro(miembroNuevo){
        var miembro = {
            nombre: miembroNuevo.nombre,
            puesto: miembroNuevo.puesto,
            funcion: miembroNuevo.funcion,
        };
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
                                        <button className="btn btn-dark" onClick={()=>this.muestraModal("muestraPF",true)} ><i className="lni lni-plus"></i>  Agregar puesto</button>
                                    </div>
                                    <div className="m-1">
                                        <button className="btn btn-primary" onClick={()=>this.muestraModal(organizacion.id === organizacion.id_organizacion ?"muestraMJDF":"muestraUF",true)}><i className="lni lni-plus"></i>  Agregar miembro</button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex align-items-center justify-content-between">
                                <div className="m-3">
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
                            <Modal show={this.state.muestraMJDF} onHide={()=>this.muestraModal("muestraMJDF",false)} className="modal-green">
                            <Modal.Body>
                                <MiembroJuntaDirectivaForm esUnion={organizacion.id === organizacion.id_organizacion} puestos={this.state.puestos} idOrganizacion={organizacion.id} avisaAgregado={this.avisaAgregadoMiembro} cerrarModal={()=>this.muestraModal("muestraMJDF",false)} />
                            </Modal.Body>
                            </Modal>
                            <Modal size='lg' show={this.state.muestraUF} onHide={()=>this.muestraModal("muestraUF",false)} className="modal-green">
                            <Modal.Body>
                                <UsuarioForm titulo="Usuario" idOrganizacion={this.props.idOrganizacion} cerrarModal={()=>this.muestraModal("muestraUF",false)} avisaCreado={this.avisaCreadoMiembro} />
                            </Modal.Body>
                            </Modal>
                            <Modal show={this.state.muestraPF} onHide={()=>this.muestraModal("muestraPF",false)} className="modal-green">
                            <Modal.Body>
                                <PuestoForm idOrganizacion={organizacion.id} avisaCreado={this.agregaPuestos} cerrarModal={()=>this.muestraModal("muestraPF",false)} />
                            </Modal.Body>
                            </Modal>
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