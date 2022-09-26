import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Tabla from '../Utilidades/Tabla';
import QueriesGenerales from "../QueriesGenerales";

class UnionCantonal extends React.Component {

    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            uniones: []
        }
        this.unionesPedidas = false;
        this.titulos = [
            {llave:"nombre",valor:"Asociación"},
            {llave:"cedula",valor:"Cédula Jurídica"},
            {llave:"domicilio",valor:"Domicilio"},
            {llave:"territorio",valor:"Territorio"},
            {llave:"telefonos",valor:"Teléfonos"},
        ];

        this.avisaCreado = this.avisaCreado.bind(this);
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

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Uniones Cantonales</h1>
                                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal"><i className="lni lni-plus"></i>  Agregar unión</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <Tabla titulos={this.titulos} datos={this.state.uniones} style={{color:"#FFFFFF"}} />
                                    </div>
                                </div>
                                <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="modalAgregarUnion" aria-hidden="true">
                                    <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                        <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                            <div className="modal-body">
                                                <OrganizacionForm esUnionCantonal={true} titulo={"Agregar Unión Cantonal"} avisaCreado={this.avisaCreado} />
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

export default UnionCantonal;