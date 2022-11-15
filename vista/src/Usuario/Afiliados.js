import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import UsuarioForm from '../Usuario/UsuarioForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Modal from 'react-bootstrap/Modal';

import Tabla from '../Utilidades/Table/Table.jsx';

/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class Afiliados extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            usuarios: [],
            usuario:{},
            indiceUsuario: null,
        }
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Identificación',selector:row=>row.identificacion,sortable:true},
            {name:'Email',selector:row=>row.email,sortable:true},
            {name:'Fecha de nacimiento',selector:row=>row.fecha_nacimiento,sortable:true},
            {name:'Profesión',selector:row=>row.profesion,sortable:true},
            {name:'Teléfonos',selector:row=>row.telefonos,sortable:true},
            ];
        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarUsuario = this.agregarUsuario.bind(this);
    }

    agregarUsuario(usuario,indice){
        if(!usuario) usuario={};
        this.setState({
            indiceUsuario:indice,
            usuario:usuario,
            muestra:true,
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }
    
    async cargarAfiliados(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultar", {id_organizacion:this.props.idOrganizacion});
            this.setState({
                usuarios:this.state.usuarios.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar
    los usuarios existentes en el sistema
    */
    async componentDidMount() {
        document.title = "Afiliados";
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
        if(!this.usuariosPedidos){
            this.usuariosPedidos = true;
            this.cargarAfiliados();
        }
    }

    async avisaCreado(usuario){
        var usuarios = this.state.usuarios;
        if(!isNaN(this.state.indiceUsuario) && this.state.indiceUsuario){
            usuarios[this.state.indiceUsuario] = usuario;
            this.setState({
                usuarios:usuarios,
            });
        } else {
            this.setState({
                usuarios:usuarios.concat(usuario),
            });
        }
    }

    render(){
        var accionesTabla = null;
        // const accionesTabla = [
        //     {
        //         nombre:"Eliminar",
        //         className:"btn-danger",
        //         onClick:this.eliminarUsuario,
        //         icon:"lni-pencil-alt",
        //     },
        // ];
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Usuario"){
                        if(organizacion.id === organizacion.id_organizacion){
                            return <Navigate to="/asociaciones" />;
                        }

                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <div>
                                        <h1>Afiliados</h1>
                                        <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                                    </div>
                                    <button className="btn btn-primary" onClick={()=>this.agregarUsuario()}><i className="lni lni-plus"></i>  Agregar usuario</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                        <Tabla titulos={this.titulos} datos={this.state.usuarios} acciones={accionesTabla} />
                                    </div>
                                </div>
                                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" centered>
                                <Modal.Body>
                                <UsuarioForm titulo="Usuario" idOrganizacion={this.props.idOrganizacion} cerrarModal={()=>this.muestraModal(false)} ocupaPuesto />
                                </Modal.Body>
                                </Modal>
                            </>
                        );
                } else {
                    return (<Navigate to='/iniciarSesion' replace={true}/>);
                }
            }}
        </usuarioContexto.Consumer>);
    }
}

export default Afiliados;