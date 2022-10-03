import React from 'react';
import { Navigate, Link } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import ProyectoForm from './ProyectoForm';
import QueriesGenerales from "../QueriesGenerales";

class Proyectos extends React.Component {
    constructor(props){
        super(props);
        this.soloVer = props.soloVer;
        this.queriesGenerales = new QueriesGenerales();
        let d = new Date();
        this.state = {
            proyectos: [],
        }
        this.proyectosPedidas = false;
        this.avisaCreado = this.avisaCreado.bind(this);
        this.eliminarProyecto = this.eliminarProyecto.bind(this);
    }

    async eliminarProyecto(id){
        try{
            await this.queriesGenerales.eliminar("/proyecto/eliminar/"+id, {});
            let i = -1;
            for (let j = 0; j < this.state.proyectos.length; j++){
                if(this.state.proyectos[j].id === id) i = j;
            }
            if (i > -1){
                this.state.proyectos.splice(i, 1);
                this.setState({});
            }
        } catch(err){
            console.log(err);
        }
    }

    async cargarProyectos(){
        try{
            var proyectos = this.state.proyectos;
            const resp = await this.queriesGenerales.obtener("/proyecto/consultar", {id_organizacion:this.props.id});
            this.setState({
                proyectos:proyectos.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.proyectosPedidas){
            this.proyectosPedidas = true;
            this.cargarProyectos();
        }
    }

    async avisaCreado(proyecto){
        var proyectos = this.state.proyectos;
        this.setState({
            proyectos:proyectos.concat(proyecto),
        });
    }

    render(){
        var proyectos;
        console.log(this.state.proyectos);
        if(this.state.proyectos.length > 0){
            proyectos = this.state.proyectos.map((p, i) =>{
                return (
                <div className="col-4 d-flex flex-column" key={"aCol"+i} style={i%2==0 ? {backgroundColor:"#137E31",color:"#FFFFFF"} : {backgroundColor:"#76B2CE",color:"#160C28"}}>
                    <div className="row">
                        <div className="col">
                            <div className="container p-3" key={"aCont"+i}>
                                <h3 key={"n"+i}>{p.nombre}</h3>
                                <p key={"p"+i}>Presupuesto: {p.presupuesto}</p>
                                <p key={"i"+i}>Inicio: {p.inicio}</p>
                                <p key={"c"+i}>Cierre: {p.cierre}</p>
                                <p key={"enc"+i}>Encargados:</p>
                                {p.usuarios ? p.usuarios.map((enc, j) => 
                                <div className="m-2 p-2" key={"encC"+i+"-"+j} style={{backgroundColor:"#160C28",borderRadius:"0.2em",color:"#fff"}}>
                                    <span key={"enc"+i+"-"+j}>{enc.nombre}</span>
                                </div>
                                ):<></>}
                            </div>
                        </div>
                        <div className="col d-flex flex-column p-3">
                            <Link onClick={()=>this.props.escogeProyecto(p)} key={"g"+i} className="btn btn-primary m-1" to={"gastos/"+p.id}><i className="lni lni-coin"></i>  Gastos</Link>
                            <button key={"e"+i} className="btn btn-danger m-1" onClick={()=>this.eliminarProyecto(p.id)}><i className="lni lni-trash-can"></i>  Eliminar</button>
                        </div>
                    </div>
                </div>
            );
            });
        }
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (<>
                        <div className="d-flex align-items-center justify-content-between m-3">
                            <h1>Proyectos</h1>
                            {this.props.soloVer ? <></>:
                            <button className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#agregarProyectoModal"><i className="lni lni-plus"></i>  Agregar proyecto</button>}
                        </div>
                        <div className="row m-0">
                            {proyectos}
                        </div>
                        <div className="modal fade" id="agregarProyectoModal" tabIndex="-1" aria-labelledby="modalAgregarUnion" aria-hidden="true">
                            <div className="modal-dialog modal-dialog-scrollable modal-lg">
                                <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                    <div className="modal-body">
                                        <ProyectoForm idOrganizacion={organizacion.id} esUnion={false} avisaCreado={this.avisaCreado} />
                                    </div>
                                </div>
                            </div>
                        </div>
                            </>);
                    } else {
                        return <Navigate to='/iniciarSesion' replace={true}/>;
                    }
                }}
            </usuarioContexto.Consumer>
        );

        
    }
}

export default Proyectos;