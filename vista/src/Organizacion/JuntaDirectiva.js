import React from 'react';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import Tabla from '../Utilidades/Table/Table.jsx';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';
import PuestoForm from './PuestoForm.js';
import QueriesGenerales from "../QueriesGenerales";
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Modal from 'react-bootstrap/Modal';
import '../Estilos/Tabs.css';
import UsuarioForm from '../Usuario/UsuarioForm';

/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class JuntaDirectiva extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            indicePuesto:null,
            indiceMiembro:null,
            Puesto:{},
            Miembro:{},
            miembros:[],
            puestos:[],
            key: "miembros",
            muestraMiembroF:false,
            muestraPuestoF:false,
            muestraUsuarioF:false,
            muestraEliminarMiembro: false,
            muestraEliminarPuesto: false,
        };
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Puesto',selector:row=>row.puesto,sortable:true},
            ];
        this.titulosPuestos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Edita página',selector:row=>row.edita_pagina ? "Sí":"No"},
            {name:'Edita Junta Directiva',selector:row=>row.edita_junta ? "Sí":"No"},
            {name:'Edita proyectos',selector:row=>row.edita_proyecto ? "Sí":"No"},
            {name:'Edita actividades',selector:row=>row.edita_actividad ? "Sí":"No"},
            ];
        this.organizacionPedida = false;
        this.puestosPedidos = true;
        this.avisaAgregadoMiembro = this.avisaAgregadoMiembro.bind(this);
        this.metePuestosEnTabla = this.metePuestosEnTabla.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.avisaCreadoMiembro = this.avisaCreadoMiembro.bind(this);
        this.eliminarPuesto = this.eliminarPuesto.bind(this);
        this.eliminarMiembro = this.eliminarMiembro.bind(this);
    }

    /*
    muestraModal hace lo que dice, muestra el modal que contiene
    a PuestoForm, MiembroJuntaDirectivaForm o UsuarioForm
    Parámetros:
    - nombre: string (pueden ser los valores Puesto, Miembro o
        Usuario),
    - muestra: booleano para saber si se muestra o se cierra el
        modal,
    - valor: objeto que se usa para saber cuál se debe modificar
        (solo es necesario si se va a modificar un dato en la tabla),
    - indice: número entero índice del valor de en la tabla (solo
        es necesario si se va a modificar un dato en la tabla)
    */
    muestraModal(nombre, muestra, valor, indice){
        if(!valor) valor={};
        this.setState({
            ["indice"+nombre]:indice,
            [nombre]:valor,
            ["muestra"+nombre+"F"]:muestra,
        })
    }

    /*
    muestraModalEliminar hace lo que dice, muestra el modal que contiene
    a ConfirmaAccion para el puesto o para el miembro
    Parámetros:
    - nombre: string (pueden ser los valores Puesto, Miembro o
        Usuario),
    - muestra: booleano para saber si se muestra o se cierra el
        modal,
    - valor: objeto que se usa para saber cuál se va a eliminar
        (solo es necesario si se va a eliminar un dato en la tabla),
    - indice: número entero índice del valor de en la tabla (solo
        es necesario si se va a eliminar un dato en la tabla)
    */
    muestraModalEliminar(nombre, muestra, valor, indice){
        if(!valor) valor={};
        this.setState({
            ["indice"+nombre]:indice,
            [nombre]:valor,
            ["muestraEliminar"+nombre]:muestra,
        })
    }
    

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente, llama a cargar los puestos
    y llama a cargar los miembros
    */
    async componentDidMount() {
        document.title = "Junta Directiva";
        if(!this.organizacionPedida){
            this.organizacionPedida = true;
            try{
                await this.props.cargarOrganizacion(this.props.idOrganizacion);
                this.cargarPuestos(this.props.idOrganizacion);
                this.cargarMiembros(this.props.idOrganizacion);
            }catch(err){
                console.log(err);
            }
        }
    }

    /*
    cargarPuestos llama al server para cargar los puestos
    existentes en una organización
    - idOrganizacion: número entero que representa el id de
        la organización
    */
    async cargarPuestos(idOrganizacion){
        try{
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultarPuestos/"+idOrganizacion, {});
            this.metePuestosEnTabla(resp.data);
        } catch(err){
            console.log(err);
        }
    }

    /*
    cargarPuestos llama al server para cargar los miembros
    existentes en una organización
    - idOrganizacion: número entero que representa el id de
        la organización
    */
    async cargarMiembros(idOrganizacion){
        try{
            var miembros = this.state.miembros;
            const resp = await this.queriesGenerales.obtener("/juntaDirectiva/consultarMiembros/"+idOrganizacion, {});
            var miembrosLista = [];
            for(let m of resp.data){
                var miembro = {
                    id_usuario: m.id_usuario.toString(),
                    id_puesto_jd:m.id_puesto_jd.toString(),
                    nombre:m.usuario.nombre,
                    puesto: m.puesto_jd.nombre,
                };
                miembrosLista.push(miembro);
            }
            this.setState({
                miembros:miembros.concat(miembrosLista),
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    avisaCreadoMiembro acomoda los datos necesarios y mete un
    nuevo miembro en la tabla, se usa cuando se crea un usuario
    con UsuarioForm
    - miembroNuevo: objeto que debe por lo menos tener los campos
        {
            id: número entero,
            nombre: string,
            puesto: número entero con id del puesto del usuario,
        }
    */
    avisaCreadoMiembro(miembroNuevo){
        var miembro = {
            id_usuario:miembroNuevo.id.toString(),
            nombre: miembroNuevo.nombre,
        };
        for(let p of this.state.puestos){
            if(p.id == miembroNuevo.puesto){
                miembro.id_puesto_jd = p.id.toString();
                miembro.puesto = p.nombre;
            }
        }
        this.avisaAgregadoMiembro(miembro);
    }
    
    /*
    avisaAgregadoMiembro acomoda los datos necesarios y mete un
    nuevo miembro en la tabla o actualiza la información de uno
    existente
    - miembroNuevo: objeto que debe por lo menos tener los campos
        {
            id_usuario: número entero,
            nombre: string,
            puesto: string con nombre del puesto,
            id_puesto_jd: número entero,
        }
    */
    async avisaAgregadoMiembro(miembroNuevo){
        var miembro = {
            id_usuario:miembroNuevo.id_usuario.toString(),
            nombre: miembroNuevo.nombre,
            puesto: miembroNuevo.puesto,
            id_puesto_jd: miembroNuevo.id_puesto_jd.toString(),
        };
        var miembros = this.state.miembros;
        // this.state.indiceMiembro nos indica si lo que se hace es
        // una modificación al dato en la tabla
        if(!isNaN(this.state.indiceMiembro) && this.state.indiceMiembro){
            miembros[this.state.indiceMiembro] = miembro;
            this.setState({
                miembros:miembros,
            });
        } else {
            this.setState({
                miembros:miembros.concat(miembro),
            });
        }
    }

    /*
    metePuestosEnTabla hace lo que dice
    - puestosNuevos: objeto o lista de objetos con la forma
        {
            id: número entero,
            nombre: string,
            edita_pagina: booleano,
            edita_junta: booleano,
            edita_proyecto: booleano,
            edita_actividad: booleano,
        }
    */
    metePuestosEnTabla(puestosNuevos){
        var puestos = this.state.puestos;
        this.setState({
            puestos:puestos.concat(puestosNuevos),
        });
    }

    /*
    eliminarPuesto hace lo que dice
    */
    async eliminarPuesto(){
        try{
            await this.queriesGenerales.eliminar("/juntaDirectiva/eliminarPuesto/"+this.state.Puesto.id, {});
            this.state.puestos.splice(this.state.indicePuesto, 1);
            this.setState({
                indicePuesto:null,
                Puesto:{},
                muestraEliminarPuesto: false,
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    eliminarMiembro elimina el miembro, pero solo de la
    junta directiva
    */
    async eliminarMiembro(){
        try{
            await this.queriesGenerales.postear("/juntaDirectiva/eliminarMiembro/", this.state.Miembro);
            this.state.miembros.splice(this.state.indiceMiembro, 1);
            this.setState({
                indiceMiembro:null,
                Miembro:{},
                muestraEliminarMiembro: false,
            });
        } catch(err){
            console.log(err);
        }
    }

    render(){
        const accionesMiembros = [
            {
                nombre:"Modificar",
                className:"btn-primary",
                onClick:(valor, indice)=>this.muestraModal("Miembro",true, valor, indice),
                icon:"lni-pencil-alt",
            },
            {
                nombre:"Eliminar",
                className:"btn-danger",
                onClick:(valor, indice)=>this.muestraModalEliminar("Miembro",true, valor, indice),
                icon:"lni-trash-can",
            },
        ];

        const accionesPuestos = [
            {
                nombre:"Modificar",
                className:"btn-primary",
                onClick:(valor, indice)=>this.muestraModal("Puesto",true, valor, indice),
                icon:"lni-pencil-alt",
            },
            {
                nombre:"Eliminar",
                className:"btn-danger",
                onClick:(valor, indice)=>this.muestraModalEliminar("Puesto",true, valor, indice),
                icon:"lni-trash-can",
            },
        ];
        return (
            <usuarioContexto.Consumer >
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Administrador" || usuario.tipo === "Usuario"){
                        return (<>
                            <div className="d-flex align-items-center justify-content-between m-3">
                                <div>
                                    <h1>Junta Directiva</h1>
                                    <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                                </div>
                                <div className="d-flex justify-content-end">
                                    <div className="m-1">
                                        <button className="btn btn-dark" onClick={()=>this.muestraModal("Puesto",true)} ><i className="lni lni-plus"></i>  Agregar puesto</button>
                                    </div>
                                    <div className="m-1">
                                        <button className="btn btn-primary" onClick={()=>this.muestraModal(organizacion.id === organizacion.id_organizacion ?"Miembro":"Usuario",true)}><i className="lni lni-plus"></i>  Agregar miembro</button>
                                    </div>
                                </div>
                            </div>
                            <div className="d-flex" style={{height:"inherit"}}>
                                <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                <Tabs id="controlled-tab-example" activeKey={this.state.key} onSelect={(key) => this.setState({key})} className="mb-3">
                                    <Tab eventKey="miembros" title="Miembros">
                                        <Tabla titulos={this.titulos} datos={this.state.miembros} acciones={accionesMiembros} />
                                    </Tab>
                                    <Tab eventKey="puestos" title="Puestos">
                                        <Tabla titulos={this.titulosPuestos} datos={this.state.puestos} acciones={accionesPuestos} />
                                    </Tab>
                                </Tabs>
                                </div>
                            </div>
                            <Modal show={this.state.muestraMiembroF} onHide={()=>this.muestraModal("Miembro",false)} className="modal-green">
                            <Modal.Body>
                                <MiembroJuntaDirectivaForm esUnion={organizacion.id === organizacion.id_organizacion} puestos={this.state.puestos} idOrganizacion={organizacion.id} avisaAgregado={this.avisaAgregadoMiembro} cerrarModal={()=>this.muestraModal("Miembro",false)} campos={this.state.Miembro} />
                            </Modal.Body>
                            </Modal>
                            <Modal size='lg' show={this.state.muestraUsuarioF} onHide={()=>this.muestraModal("Usuario",false)} className="modal-green">
                            <Modal.Body>
                                <UsuarioForm titulo="Usuario" idOrganizacion={this.props.idOrganizacion} cerrarModal={()=>this.muestraModal("Usuario",false)} avisaCreado={this.avisaCreadoMiembro} />
                            </Modal.Body>
                            </Modal>
                            <Modal show={this.state.muestraPuestoF} onHide={()=>this.muestraModal("Puesto",false)} className="modal-green">
                            <Modal.Body>
                                <PuestoForm idOrganizacion={organizacion.id} avisaEnviado={this.metePuestosEnTabla} cerrarModal={()=>this.muestraModal("Puesto",false)} campos={this.state.Puesto} />
                            </Modal.Body>
                            </Modal>
                            <Modal show={this.state.muestraEliminarMiembro} onHide={()=>this.muestraModalEliminar("Miembro",false)} className="modal-green">
                            <Modal.Body>
                                <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar a "+this.state.Miembro.nombre+" de la Junta Directiva?"} accion={this.eliminarMiembro} cerrarModal={()=>this.muestraModalEliminar("Puesto",false)} />
                            </Modal.Body>
                            </Modal>
                            <Modal show={this.state.muestraEliminarPuesto} onHide={()=>this.muestraModalEliminar("Puesto",false)} className="modal-green">
                            <Modal.Body>
                                <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar el puesto de "+this.state.Puesto.nombre+"?"} accion={this.eliminarPuesto} cerrarModal={()=>this.muestraModalEliminar("Miembro",false)} />
                            </Modal.Body>
                            </Modal>
                            </>);
                    } else {
                        return <Navigate to='/iniciarSesion' replace={true}/>;
                    }
                }}
            </usuarioContexto.Consumer >
        );
    }
}

export default JuntaDirectiva;