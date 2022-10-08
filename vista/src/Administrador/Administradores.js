import React from 'react';
import UsuarioForm from '../Usuario/UsuarioForm';
import Tabla from '../Utilidades/Table/Table.jsx';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';

class Administradores extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            administradores: [],
        }
        this.administradoresPedidos = false;
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
    // Hay que hacer que se puedan pedir solo administradores con información importante
    async cargarAdministradores(){
        try{
            const resp = await this.queriesGenerales.obtener("/usuario/consultarTipo/1", {});
            this.setState({
                administradores:this.state.administradores.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    async avisaCreado(usuario){
        var administradores = this.state.administradores;
        this.setState({
            administradores:administradores.concat(usuario),
        });
    }

    componentDidMount() {
        if(!this.administradoresPedidos){
            this.administradoresPedidos = true;
            this.cargarAdministradores();
        }
    }

    agregarUsuario(){
        this.setState({
            usuario:{},
            muestra:true,
        })
    }

    muestraModal(muestra){
        this.setState({
            muestra:muestra,
        })
    }

    render(){
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Administradores</h1>
                    <button className="btn btn-primary" onClick={this.agregarUsuario}><i className="lni lni-plus"></i>  Agregar administrador</button>
                </div>
                <div className="d-flex" style={{height:"inherit"}}>
                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                        <Tabla titulos={this.titulos} datos={this.state.administradores} style={{color:"#FFFFFF"}} />
                    </div>
                </div>
                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green" scrollable>
                <Modal.Body>
                    <UsuarioForm administrador={true} titulo={"Agregar Administrador"} avisaCreado={this.avisaCreado} campos={this.state.administrador} cerrarModal={()=>this.muestraModal(false)} />
                </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default Administradores;