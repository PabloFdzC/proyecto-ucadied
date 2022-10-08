import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Table/Table.jsx';
import Modal from 'react-bootstrap/Modal';
import QueriesGenerales from "../QueriesGenerales";

/*
No recibe props
*/
class UnionCantonal extends React.Component {

    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            uniones: [],
            muestra:false,
            union:{},
        }
        this.unionesPedidas = false;
        this.titulos = [
            {name:'Asociación',selector:row=>row.nombre,sortable:true},
            {name:'Cédula Jurídica',selector:row=>row.cedula,sortable:true},
            {name:'Domicilio',selector:row=>row.domicilio,sortable:true},
            {name:'Territorio',selector:row=>row.territorio,sortable:true},
            {name:'Teléfonos',selector:row=>row.telefonos,sortable:true},
            ];

        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarUnion = this.agregarUnion.bind(this);
    }

    async cargarUniones(){
        try{
            var uniones = this.state.uniones;
            const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/1", {});
            this.setState({
                uniones:uniones.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.unionesPedidas){
            this.unionesPedidas = true;
            this.cargarUniones();
        }
    }

    async avisaCreado(union){
        var uniones = this.state.uniones;
        this.setState({
            uniones:uniones.concat(union),
        });
    }

    agregarUnion(){
        this.setState({
            union:{},
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
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Uniones Cantonales</h1>
                                    <button className="btn btn-primary" onClick={this.agregarUnion}><i className="lni lni-plus"></i>  Agregar unión</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.uniones} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" scrollable>
                                <Modal.Body>
                                    <OrganizacionForm ingresaJunta={true} esUnionCantonal={true} titulo={"Unión Cantonal"} avisaCreado={this.avisaCreado} campos={this.state.union} cerrarModal={()=>this.muestraModal(false)} />
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

export default UnionCantonal;