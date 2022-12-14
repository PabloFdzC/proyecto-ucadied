import React from 'react';
import { Navigate, Link } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import ProyectoForm from './ProyectoForm';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class Proyectos extends React.Component {
    constructor(props){
        super(props);
        this.soloVer = props.soloVer;
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            Proyecto:{},
            proyectos: [],
            muestraPF:false,
            mensajeModal:"",
            muestraEliminarProyecto:false,
        }
        this.proyectosPedidos = false;
        this.avisaCreado = this.avisaCreado.bind(this);
        this.eliminarProyecto = this.eliminarProyecto.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
    }

    async eliminarProyecto(){
        try{
            const id = this.state.Proyecto.id;
            await this.queriesGenerales.eliminar("/proyecto/eliminar/"+id, {});
            let i = -1;
            for (let j = 0; j < this.state.proyectos.length; j++){
                if(this.state.proyectos[j].id === id) i = j;
            }
            if (i > -1){
                this.state.proyectos.splice(i, 1);
                this.setState({
                    mensajeModal:"¡Eliminado con éxito!",
                });
            }
        } catch(err){
            console.log(err);
        }
    }

    async cargarProyectos(){
        try{
            var proyectos = this.state.proyectos;
            const resp = await this.queriesGenerales.obtener("/proyecto/consultar", {id_organizacion:this.props.idOrganizacion});
            this.setState({
                proyectos:proyectos.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    muestraModal(muestra){
        this.setState({
            muestraPF:muestra,
            mensajeModal:"",
        });
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente y llama a cargar los proyectos
    */
    async componentDidMount() {
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
        if(!this.proyectosPedidos){
            this.proyectosPedidos = true;
            this.cargarProyectos();
        }
    }

    async avisaCreado(proyecto){
        var proyectos = this.state.proyectos;
        this.setState({
            proyectos:proyectos.concat(proyecto),
        });
    }

    muestraEliminarProyecto(muestra, valor){
        if(!valor) valor={};
        this.setState({
            Proyecto:valor,
            muestraEliminarProyecto:muestra,
            mensajeModal:"",
        })
    }

    render(){
        var proyectos;
        if(this.state.proyectos.length > 0){
            proyectos = this.state.proyectos.map((p, i) =>{
                return (
                <div className="col-4 d-flex flex-column" key={"aCol"+i} style={i%2===0 ? {backgroundColor:"#137E31",color:"#FFFFFF"} : {backgroundColor:"#76B2CE",color:"#160C28"}}>
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
                            <Link key={"g"+i} className="btn btn-primary m-1" to={"gastos/"+p.id}><i className="lni lni-coin"></i>  Gastos</Link>
                            <button key={"e"+i} className="btn btn-danger m-1" onClick={()=>this.muestraEliminarProyecto(true, p)}><i className="lni lni-trash-can"></i>  Eliminar</button>
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
                            <div>
                                <h1>Proyectos</h1>
                                <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                            </div>
                            <button className="btn btn-primary" onClick={()=>this.muestraModal(true)} ><i className="lni lni-plus"></i>  Agregar proyecto</button>
                        </div>
                        <div className="row m-0">
                            {proyectos}
                        </div>
                        <Modal size="lg" show={this.state.muestraPF} onHide={()=>this.muestraModal(false)} className="modal-green" centered>
                        <Modal.Body>
                            <ProyectoForm idOrganizacion={organizacion.id} esUnion={false} avisaCreado={this.avisaCreado} cerrarModal={()=>this.muestraModal(false)} />
                        </Modal.Body>
                        </Modal>
                        <Modal show={this.state.muestraEliminarProyecto} onHide={()=>this.muestraEliminarProyecto(false)} className="modal-green" centered>
                        <Modal.Body>
                            {this.state.mensajeModal === "" ?
                                <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar "+this.state.Proyecto.nombre+"?"} accion={this.eliminarProyecto} cerrarModal={()=>this.muestraEliminarProyecto(false)} accionNombre="Eliminar" />
                            :
                                <>
                                    <h3 className="text-center">{this.state.mensajeModal}</h3>
                                    <div className="d-flex justify-content-end">
                                        <div className="m-1">
                                            <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraEliminarProyecto(false)}>Volver</button>
                                        </div>
                                    </div>
                                </>}
                        </Modal.Body>
                        </Modal>
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