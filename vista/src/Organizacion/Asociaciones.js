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
        this.avisaCreado = this.avisaCreado.bind(this);
        this.eliminarAsociacion = this.eliminarAsociacion.bind(this);
    }

    async eliminarAsociacion(id){
        try{
            await this.queriesGenerales.eliminar("/organizacion/eliminar/"+id, {});
            let i = -1;
            for (let j = 0; j < this.state.asociaciones.length; j++){
                if(this.state.asociaciones[j].id === id) i = j;
            }
            if (i > -1){
                this.state.asociaciones.splice(i, 1);
                this.setState({});
            }
        } catch(err){
            console.log(err);
        }
    }

    async cargarAsociaciones(){
        try{
            var asociaciones = this.state.asociaciones;
            const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/0", {});
            this.setState({
                asociaciones:asociaciones.concat(resp.data),
            });
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

    async avisaCreado(asociacion){
        var asociaciones = this.state.asociaciones;
        this.setState({
            asociaciones:asociaciones.concat(asociacion),
        });
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
                        <p key={"tels"+i}>Telefonos:</p>
                        {a.telefonos.map((t, j) => 
                            <p key={"tels"+i+"-"+j}>{t}</p>
                        )}
                    
                        <div className="d-flex justify-content-end">
                            {this.props.soloVer ?
                            <div className="m-1" key={"vCol"+i}>
                                <button key={"v"+i} className="btn btn-primary">Visitar</button>
                            </div> :
                            <>
                                <div className="m-1" key={"eCol"+i}>
                                    <button key={"e"+i} className="btn btn-danger" onClick={()=>this.eliminarAsociacion(a.id)}>Eliminar</button>
                                </div>
                                <div className="m-1" key={"vCol"+i}>
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
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Asociaciones</h1>
                    {this.props.soloVer ? <></>:
                    <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#agregarAsociacionModal"><i className="lni lni-plus"></i>  Agregar asociación</button>}
                </div>
                <div className="row m-0">
                    {asociaciones}
                </div>
                {this.props.soloVer ? <></>:
                    <div className="modal fade" id="agregarAsociacionModal" tabIndex="-1" aria-labelledby="modalAgregarUnion" aria-hidden="true">
                        <div className="modal-dialog modal-dialog-scrollable modal-lg">
                            <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                <div className="modal-body">
                                    <OrganizacionForm esUnion={false} titulo={"Agregar Asociación"} avisaCreado={this.avisaCreado} />
                                </div>
                            </div>
                        </div>
                    </div>
                    }
            </>
        );

        
    }
}

export default Asociaciones;