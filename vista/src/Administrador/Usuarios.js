import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import UsuarioForm from '../Usuario/UsuarioForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Modal from 'react-bootstrap/Modal';

import Tabla from '../Utilidades/Table/Table.jsx';

class Usuarios extends React.Component {
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
            {name:'Sexo',selector:row=>row.sexo,sortable:true},
            {name:'Email',selector:row=>row.email,sortable:true},
            {name:'Fecha de nacimiento',selector:row=>row.fecha_nacimiento,sortable:true},
            {name:'Profesión',selector:row=>row.profesion,sortable:true},
            {name:'Nacionalidad',selector:row=>row.nacionalidad,sortable:true},
            {name:'Teléfonos',selector:row=>row.telefonos,sortable:true},
            ];
        this.avisaCreado = this.avisaCreado.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.agregarUsuario = this.agregarUsuario.bind(this);
    }

    agregarUsuario(usuario,indice){
        if(!usuario) usuario={};
        this.setState({
            indiceInmueble:indice,
            usuario:usuario,
            muestra:true,
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }
    
    async cargarUsuarios(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultarTipo/0", {});
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
    componentDidMount() {
        document.title = "Usuarios";
        if(!this.usuariosPedidos){
            this.usuariosPedidos = true;
            this.cargarUsuarios();
        }
    }

    async avisaCreado(usuario){
        var usuarios = this.state.usuarios;
        if(!isNaN(this.state.indiceUsuario)){
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
        //         className:"btn-primary",
        //         onClick:this.agregarUsuario,
        //         icon:"lni-pencil-alt",
        //     },
        // ];
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Usuarios</h1>
                                    <button className="btn btn-primary" onClick={()=>this.agregarUsuario()}><i className="lni lni-plus"></i>  Agregar usuario</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                        <Tabla titulos={this.titulos} datos={this.state.usuarios} acciones={accionesTabla} />
                                    </div>
                                </div>
                                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green">
                                <Modal.Body>
                                    <UsuarioForm administrador={false} titulo={"Usuario"} ocupaAsociacion={true} avisaCreado={this.avisaCreado} campos={this.state.usuario} cerrarModal={()=>this.muestraModal(false)} />
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

export default Usuarios;