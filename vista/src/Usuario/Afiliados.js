import React from 'react';
import QueriesGenerales from "../QueriesGenerales";

import Tabla from '../Utilidades/Tabla.js'

class Afiliados extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.cargarAfiliados = this.cargarAfiliados.bind(this);
    }

    async cargarAfiliados(){
        try{
            await this.queriesGenerales.obtener("/usuario/consultar", {});
        }catch(error){
            //console.log(error);
        }
    }

    render(){
        return (
            <Tabla titulos={["1", "2"]} datos={[["a", "b"],["a", "b"],["a", "b"]]} />
        );
    }
}

export default Afiliados;