import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import QueriesGenerales from "../QueriesGenerales";
import Tabla from '../Utilidades/Tabla';

class Asociaciones extends React.Component {
    constructor(props){
        super(props);
        this.soloVer = props.soloVer;
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            asociaciones: [],
        }
        this.asociacionesPedidas = false;
        this.titulos = [
            {llave:"nombre",valor:"Asociación"},
            {llave:"cedula",valor:"Cédula"},
            {llave:"domicilio",valor:"Domicilio"},
            {llave:"territorio",valor:"Territorio"},
            {llave:"telefonos",valor:"Telefonos"},
        ];
    }

    async cargarAsociaciones(){
        try{
            var asociaciones = this.state.asociaciones;
            const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/0", {});
            this.setState({
                asociaciones:asociaciones.concat(resp.data),
            });
            // this.setState({
            //     asociaciones:asociaciones.concat([{
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
        if(!this.asociacionesPedidas){
            this.asociacionesPedidas = true;
            this.cargarAsociaciones();
        }
    }

    render(){
        var asociaciones;
        if(this.state.asociaciones.length > 0){
            asociaciones = this.state.asociaciones.map((a, i) =>{
                return (
                <div className="col-4" key={"aCol"+i} style={i%2==0 ? {backgroundColor:"#137E31",color:"#FFFFFF"} : {backgroundColor:"#76B2CE",color:"#160C28"}}>
                    <div className="container p-3" key={"aCont"+i}>
                        <h3 key={"t"+i}>{a.nombre}</h3>
                        <p key={"c"+i}>Cédula jurídica: {a.cedula}</p>
                        <p key={"d"+i}>Domicilio: {a.domicilio}</p>
                        <p key={"te"+i}>Territorio: {a.territorio}</p>
                        {/* {a.telefonos.map((t, j) => {
                            <p key={"tels"+i+"-"+j}>{t}</p>
                        })} */}
                        <div className="row justify-content-end">
                            {this.props.soloVer ?
                            <div className="col-3" key={"vCol"+i}>
                                <button key={"v"+i} className="btn btn-primary">Visitar</button>
                            </div> :
                            <>
                                <div className="col-3" key={"eCol"+i}>
                                    <button key={"e"+i} className="btn btn-danger">Eliminar</button>
                                </div>
                                <div className="col-3" key={"vCol"+i}>
                                    <button key={"v"+i} className="btn btn-primary">Visitar</button>
                                </div>
                            </>
                        }
                        </div>
                    </div>
                </div>
            );
            });
        }
         console.log("Render");
        console.log(this.state.asociaciones);
        return (
            <div>
                <div className="row align-items-center justify-content-between m-3">
                    <div className="col-8">
                        <h1>Asociaciones</h1>
                    </div>
                    <div className="col-2">
                        <button className="btn btn-primary"><i className="lni lni-plus"></i>  Agregar asociación</button>
                    </div>
                </div>
                <div className="row">
                    {asociaciones}
                    {this.props.soloVer ? <></>:
                    <div className="container p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                        <div className="row">
                            <h2 className="text-center">Agregar Asociación</h2>
                        </div>
                        <div className="container">
                        <OrganizacionForm esUnion={false} />
                        </div>
                    </div>
                    }
                </div>
            </div>
        );

        
    }
}

export default Asociaciones;