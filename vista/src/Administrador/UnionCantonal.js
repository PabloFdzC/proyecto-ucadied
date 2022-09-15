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
            {llave:"cedula",valor:"Cédula"},
            {llave:"domicilio",valor:"Domicilio"},
            {llave:"territorio",valor:"Territorio"},
            {llave:"telefonos",valor:"Telefonos"},
        ];
    }

    async cargarUniones(){
        try{
            var uniones = this.state.uniones;
            const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/1", {});
            this.setState({
                uniones:uniones.concat(resp.data),
            });
            // this.setState({
            //     uniones:uniones.concat([{
            //         nombre:"Asociacion",
            //         cedula:"111111111",
            //         domicilio:"lugar",
            //         territorio:"lugar",
            //         telefonos:["2222222222","3333333333"]
            //     },
            //     {
            //         nombre:"Asociacion",
            //         cedula:"111111111",
            //         domicilio:"lugar",
            //         territorio:"lugar",
            //         telefonos:["2222222222","3333333333"]
            //     },
            //     {
            //         nombre:"Asociacion",
            //         cedula:"111111111",
            //         domicilio:"lugar",
            //         territorio:"lugar",
            //         telefonos:["2222222222","3333333333"]
            //     },
            //     {
            //         nombre:"Asociacion",
            //         cedula:"111111111",
            //         domicilio:"lugar",
            //         territorio:"lugar",
            //         telefonos:["2222222222","3333333333"]
            //     },
            //     {
            //         nombre:"Asociacion",
            //         cedula:"111111111",
            //         domicilio:"lugar",
            //         territorio:"lugar",
            //         telefonos:["2222222222","3333333333"]
            //     },
            //     {
            //         nombre:"Asociacion",
            //         cedula:"111111111",
            //         domicilio:"lugar",
            //         territorio:"lugar",
            //         telefonos:["2222222222","3333333333"]
            //     },]),
            // });
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

    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <div>
                                <div className="row align-items-center justify-content-between m-3">
                                    <div className="col-8">
                                        <h1>Uniones Cantonales</h1>
                                    </div>
                                    <div className="col-2">
                                        <button className="btn btn-primary"><i className="lni lni-plus"></i>  Agregar unión</button>
                                    </div>
                                </div>
                                <div className="row m-0">
                                    <Tabla titulos={this.titulos} datos={this.state.uniones} />
                                </div>
                                <div className="row m-0">
                                    <div className="container p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="row">
                                        <h2 className="text-center">Agregar Unión Cantonal</h2>
                                    </div>
                                    <div className="container">
                                        <OrganizacionForm esUnionCantonal={true} />
                                    </div>
                                </div>
                                </div>
                            </div>
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