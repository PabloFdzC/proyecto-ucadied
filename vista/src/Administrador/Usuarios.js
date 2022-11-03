import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import UsuarioForm from '../Usuario/UsuarioForm';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import Modal from 'react-bootstrap/Modal';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

import Tabla from '../Utilidades/Table/Table.jsx';

class Usuarios extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            usuarios: [],
            Usuario:{},
            muestraFormUsuario:false,
            muestraEliminarUsuario:false,
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
        this.eliminarUsuario = this.eliminarUsuario.bind(this);
    }


    async eliminarUsuario(){
        try{
            const idUsuario = this.state.Usuario.id;
            await this.queriesGenerales.eliminar("/usuario/eliminar/"+idUsuario, {});
            const indice = this.buscarUsuarioEnLista(idUsuario);
            console.log("idUsuario");
            console.log(idUsuario);
            console.log("indice");
            console.log(indice);
            let usuarios = this.state.usuarios;
            usuarios.splice(indice, 1);
            this.setState({
                usuarios,
                Usuario:{},
                muestraEliminarUsuario: false,
            });
        } catch(err){
            console.log(err);
        }
    }

    muestraModal(nombre, muestra, Usuario){
        if(!Usuario) Usuario={};
        console.log(Usuario);
        this.setState({
            Usuario,
            [nombre]:muestra,
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
        if(!isNaN(this.state.Usuario.id) && this.state.Usuario.id){
            const indice = this.buscarUsuarioEnLista(this.state.Usuario.id);
            usuarios[indice] = usuario;
            this.setState({
                usuarios:usuarios,
            });
        } else {
            this.setState({
                usuarios:usuarios.concat(usuario),
            });
        }
    }

    buscarUsuarioEnLista(idUsuario){
        return this.state.usuarios.findIndex(usuario => {
            return usuario.id === idUsuario;
            });
    }

    render(){
        const accionesTabla = [
            {
                nombre:"Eliminar",
                className:"btn-danger",
                onClick:(valor)=>this.muestraModal("muestraEliminarUsuario",true, valor),
                icon:"lni-trash-can",
            },
        ];
        return (
            <usuarioContexto.Consumer >
                {({usuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <h1>Usuarios</h1>
                                    <button className="btn btn-primary" onClick={()=>this.muestraModal("muestraFormUsuario",true)}><i className="lni lni-plus"></i>  Agregar usuario</button>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                        <Tabla titulos={this.titulos} datos={this.state.usuarios} acciones={accionesTabla}  />
                                    </div>
                                </div>
                                <Modal size="lg" show={this.state.muestraFormUsuario} onHide={()=>this.muestraModal("muestraFormUsuario",false)} className="modal-green" centered>
                                <Modal.Body>
                                    <UsuarioForm administrador={false} titulo={"Usuario"} ocupaAsociacion ocupaPuesto avisaCreado={this.avisaCreado} campos={this.state.Usuario} cerrarModal={()=>this.muestraModal("muestraFormUsuario",false)} />
                                </Modal.Body>
                                </Modal>
                                
                                <Modal show={this.state.muestraEliminarUsuario} onHide={()=>this.muestraModal("muestraEliminarUsuario",false)} className="modal-green" centered>
                                <Modal.Body>
                                    <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar el usuario de "+this.state.Usuario.nombre+"?"} accion={this.eliminarUsuario} cerrarModal={()=>this.muestraModal("muestraEliminarUsuario",false)} accionNombre="Eliminar" />
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