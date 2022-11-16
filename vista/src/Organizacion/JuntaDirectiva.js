import React from 'react';
import { Navigate } from "react-router-dom";
import {usuarioContexto} from '../usuarioContexto';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import Tabla from '../Utilidades/Table/Table.jsx';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
import '../Estilos/Tabs.css';
import UsuarioForm from '../Usuario/UsuarioForm';
import { buscarEnListaPorId } from '../Utilidades/ManejoLista';

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
            Puesto:{},
            Usuario:{},
            puestos:[],
            key: "puestos",
            muestraPuestoF:false,
            muestraUsuarioF:false,
            muestraEliminarPuesto: false,
            mensajeModal: "",
        };
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Puesto',selector:row=>row.puesto,sortable:true},
            {name:'Edita página',selector:row=>row.edita_pagina ? "Sí":"No"},
            {name:'Edita Junta Directiva',selector:row=>row.edita_junta ? "Sí":"No"},
            {name:'Edita proyectos',selector:row=>row.edita_proyecto ? "Sí":"No"},
            {name:'Edita actividades',selector:row=>row.edita_actividad ? "Sí":"No"},
            {name:'Edita inmuebles',selector:row=>row.edita_inmueble ? "Sí":"No"},
            ];
        this.organizacionPedida = false;
        this.actualizaTablaPuesto = this.actualizaTablaPuesto.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
        this.avisaCreadoPuesto = this.avisaCreadoPuesto.bind(this);
        this.eliminarPuesto = this.eliminarPuesto.bind(this);
    }

    /*
    muestraModal hace lo que dice, muestra el modal que contiene
    a MiembroJuntaDirectivaForm o UsuarioForm
    Parámetros:
    - nombre: string (pueden ser los valores Puesto o
        Usuario),
    - muestra: booleano para saber si se muestra o se cierra el
        modal,
    - valor: objeto que se usa para saber cuál se debe modificar
        (solo es necesario si se va a modificar un dato en la tabla),
    */
    muestraModal(nombre, muestra, valor){
        console.log(valor);
        if(!valor) valor={};
        this.setState({
            [nombre]:valor,
            ["muestra"+nombre+"F"]:muestra,
        });
    }

    /*
    muestraModalEliminar hace lo que dice, muestra el modal que contiene
    a ConfirmaAccion para el puesto
    Parámetros:
    - nombre: string (pueden ser los valores Puesto o
        Usuario),
    - muestra: booleano para saber si se muestra o se cierra el
        modal,
    - valor: objeto que se usa para saber cuál se va a eliminar
        (solo es necesario si se va a eliminar un dato en la tabla),
    */
    muestraModalEliminar(nombre, muestra, valor){
        if(!valor) valor={};
        this.setState({
            [nombre]:valor,
            ["muestraEliminar"+nombre]:muestra,
            mensajeModal:"",
        })
    }
    

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente, llama a cargar los puestos
    */
    async componentDidMount() {
        document.title = "Junta Directiva";
        if(!this.organizacionPedida){
            this.organizacionPedida = true;
            try{
                await this.props.cargarOrganizacion(this.props.idOrganizacion);
                await this.cargarPuestos(this.props.idOrganizacion);
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
            var puestos = this.state.puestos;
            const resp = await this.queriesGenerales.obtener("/puesto/consultar", {
                id_organizacion: idOrganizacion,
            });
            var puestosLista = [];
            for(let m of resp.data){
                var puesto = {
                    id_usuario: m.id_usuario.toString(),
                    id:m.id,
                    nombre:m.usuario.nombre,
                    puesto: m.nombre,
                    edita_pagina: m.edita_pagina,
                    edita_junta: m.edita_junta,
                    edita_proyecto: m.edita_proyecto,
                    edita_actividad: m.edita_actividad,
                    edita_inmueble: m.edita_inmueble,
                };
                puestosLista.push(puesto);
            }
            this.setState({
                puestos:puestos.concat(puestosLista),
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    avisaCreadoPuesto acomoda los datos necesarios y mete un
    nuevo puesto en la tabla, se usa cuando se crea un usuario
    con UsuarioForm
    - puestoNuevo: objeto que debe por lo menos tener los campos
        {
            id: número entero,
            nombre: string,
            puesto: string,
            edita_pagina: booleano,
            edita_junta: booleano,
            edita_proyecto: booleano,
            edita_actividad: booleano,
            edita_inmueble: booleano,
        }
    */
    async avisaCreadoPuesto(puestoNuevo){
        try{
            const usuario = {
                id_usuario: puestoNuevo.id.toString(),
                id:puestoNuevo.id_puesto,
                nombre:puestoNuevo.nombre,
                puesto: puestoNuevo.puesto,
                edita_pagina: puestoNuevo.edita_pagina,
                edita_junta: puestoNuevo.edita_junta,
                edita_proyecto: puestoNuevo.edita_proyecto,
                edita_actividad: puestoNuevo.edita_actividad,
                edita_inmueble: puestoNuevo.edita_inmueble,
            };
            this.actualizaTablaPuesto(usuario);
        }catch(err){
            console.log(err);
        }
    }
    
    /*
    actualizaTablaPuesto acomoda los datos necesarios y mete un
    nuevo puesto en la tabla o actualiza la información de uno
    existente
    Parámetros:
    - puestoNuevo: objeto que debe por lo menos tener los campos
        {
            id_usuario: número entero,
            nombre: string,
            puesto: string con nombre del puesto,
            id: número entero que es el id del puesto,
            edita_pagina: booleano,
            edita_junta: booleano,
            edita_proyecto: booleano,
            edita_actividad: booleano,
            edita_inmueble: booleano,
        }
    */
    async actualizaTablaPuesto(puestoNuevo){
        var puestos = this.state.puestos;
        if(!isNaN(this.state.Puesto.id) && this.state.Puesto.id){
            const indice = buscarEnListaPorId(puestos, this.state.Puesto.id);
            puestos[indice] = puestoNuevo;
            this.setState({
                puestos:puestos,
            });
            puestoNuevo.id_usuario = parseInt(puestoNuevo.id_usuario);
            puestoNuevo.id = parseInt(puestoNuevo.id);
        } else {
            this.setState({
                puestos:puestos.concat(puestoNuevo),
            });
        }
    }

    /*
    eliminarPuesto elimina el miembro, pero solo de la
    junta directiva de la organización actual
    */
    async eliminarPuesto(){
        try{
            const puestoId = this.state.Puesto.id;
            await this.queriesGenerales.eliminar("/puesto/eliminar/"+puestoId, {});
            const indice = buscarEnListaPorId(this.state.puestos, puestoId);
            if(indice > -1){
                this.state.puestos.splice(indice, 1);
            }
            this.setState({
                mensajeModal: "¡Eliminado con éxito!",
            });
        } catch(err){
            console.log(err);
        }
    }


    render(){
        const accionesPuestos = [
            {
                nombre:"Modificar",
                className:"btn-primary",
                onClick:(valor)=>this.muestraModal("Puesto",true, valor),
                icon:"lni-pencil-alt",
            },
            {
                nombre:"Eliminar",
                className:"btn-danger",
                onClick:(valor)=>this.muestraModalEliminar("Puesto",true, valor),
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
                                    {organizacion.id === organizacion.id_organizacion ?
                                        <>
                                        <div className="m-1">
                                            <button className="btn btn-primary" onClick={()=>this.muestraModal("Puesto",true)}><i className="lni lni-plus"></i>  Agregar puesto a usuario</button>
                                        </div>
                                        </>
                                    :
                                        <>
                                        <div className="m-1">
                                            <button className="btn btn-dark" onClick={()=>this.muestraModal("Puesto",true)}><i className="lni lni-plus"></i>  Agregar puesto a usuario</button>
                                        </div>
                                        <div className="m-1">
                                            <button className="btn btn-primary" onClick={()=>this.muestraModal("Usuario",true)}><i className="lni lni-plus"></i>  Agregar miembro</button>
                                        </div>
                                        </>
                                    }
                                </div>
                            </div>
                            <div className="d-flex" style={{height:"100%"}}>
                                <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                <Tabla titulos={this.titulos} datos={this.state.puestos} acciones={accionesPuestos} />
                                </div>
                            </div>
                            <Modal show={this.state.muestraPuestoF} onHide={()=>this.muestraModal("Puesto",false)} className="modal-green" centered>
                            <Modal.Body>
                                {usuario.id == this.state.Puesto.id_usuario ? 
                                <>
                                <h3 className="text-center">No puede modificar su propio puesto</h3>
                                <div className="d-flex justify-content-end">
                                    <button className="btn btn-secondary" onClick={()=>this.muestraModal("Puesto",false)}>Volver</button>
                                </div>
                                
                                </>
                                :
                                <MiembroJuntaDirectivaForm esUnion={organizacion.id === organizacion.id_organizacion}  idOrganizacion={organizacion.id} avisaEnviado={this.actualizaTablaPuesto} cerrarModal={()=>this.muestraModal("Puesto",false)} campos={this.state.Puesto} />
                                }
                            </Modal.Body>
                            </Modal>
                            <Modal size='lg' show={this.state.muestraUsuarioF} onHide={()=>this.muestraModal("Usuario",false)} className="modal-green" centered>
                            <Modal.Body>
                                <UsuarioForm titulo="Usuario" idOrganizacion={this.props.idOrganizacion} cerrarModal={()=>this.muestraModal("Usuario",false)} avisaCreado={this.avisaCreadoPuesto} ocupaPuesto />
                            </Modal.Body>
                            </Modal>
                            <Modal show={this.state.muestraEliminarPuesto} onHide={()=>this.muestraModalEliminar("Puesto",false)} className="modal-green" centered>
                            <Modal.Body>
                                {usuario.id == this.state.Puesto.id_usuario ? 
                                    <>
                                    <h3 className="text-center">No puede eliminar su propio puesto</h3>
                                    <div className="d-flex justify-content-end">
                                        <button className="btn btn-secondary" onClick={()=>this.muestraModal("Puesto",false)}>Volver</button>
                                    </div>
                                    
                                    </>
                                :
                                    this.state.mensajeModal === "" ?
                                        <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar a "+this.state.Puesto.nombre+" de la Junta Directiva?"} accion={this.eliminarPuesto} cerrarModal={()=>this.muestraModalEliminar("Puesto",false)} accionNombre="Eliminar" />
                                    :
                                        <>
                                            <h3 className="text-center">{this.state.mensajeModal}</h3>
                                            <div className="d-flex justify-content-end">
                                                <div className="m-1">
                                                    <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModalEliminar("Puesto",false)}>Volver</button>
                                                </div>
                                            </div>
                                        </>
                                }
                                
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