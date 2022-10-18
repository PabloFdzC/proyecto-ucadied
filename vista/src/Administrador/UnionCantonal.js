import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Table/Table.jsx';
import Modal from 'react-bootstrap/Modal';
import QueriesGenerales from "../QueriesGenerales";
import CajasOrganizaciones from '../Organizacion/CajasOrganizaciones';

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
            ingresaJunta:true,
            union:{},
            indiceUnion: null,
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
        this.eliminarUnion = this.eliminarUnion.bind(this);
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

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar
    las uniones cantonales que existan en el sistema
    */
    componentDidMount() {
        document.title = "Uniones Cantonales";
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

    agregarUnion(union,indice){
        if(union){
            if(union.puestos){
                union.puestos = [];
            }
        } else {
            union={};
        }
        this.setState({
            union:union,
            muestra:true,
            ingresaJunta: !indice,
            indiceUnion: indice
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }


    async eliminarUnion(id){
        try{
            await this.queriesGenerales.eliminar("/organizacion/eliminar/"+id, {});
            let i = -1;
            for (let j = 0; j < this.state.uniones.length; j++){
                if(this.state.uniones[j].id === id) i = j;
            }
            if (i > -1){
                this.state.uniones.splice(i, 1);
                this.setState({});
            }
        } catch(err){
            console.log(err);
        }
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
                                    <button className="btn btn-primary" onClick={()=>this.agregarUnion()}><i className="lni lni-plus"></i>  Agregar unión</button>
                                </div>
                                <div className="row m-0">
                                    <CajasOrganizaciones organizaciones={this.state.uniones} modificar={this.agregarUnion} eliminar={this.eliminarUnion} />
                                </div>
                                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" >
                                <Modal.Body>
                                    <OrganizacionForm ingresaJunta={this.state.ingresaJunta} esUnionCantonal={true} titulo={"Unión Cantonal"} avisaCreado={this.avisaCreado} campos={this.state.union} cerrarModal={()=>this.muestraModal(false)} />
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