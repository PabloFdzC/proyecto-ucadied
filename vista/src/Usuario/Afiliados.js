import React from 'react';
import QueriesGenerales from "../QueriesGenerales";

import Tabla from '../Utilidades/Tabla.js'

class Afiliados extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            afiliados: []
        }
        this.titulos = [
            {llave:"email",valor:"Email"},
            {llave:"tipo",valor:"Tipo"},
        ];
    }
    // Hay que hacer que se puedan consultar solo los usuarios que pertenezcan a una unión
    async cargarAfiliados(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultar", {});
            this.setState({
                afiliados:this.state.afiliados.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.afiliadosPedidos){
            this.afiliadosPedidos = true;
            this.cargarAfiliados();
        }
    }

    render(){
        return (
            <Tabla titulos={this.titulos} datos={this.state.afiliados} />
        );
    }
}

export default Afiliados;