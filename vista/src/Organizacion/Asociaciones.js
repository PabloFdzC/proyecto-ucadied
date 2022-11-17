import React from 'react';
import OrganizacionForm from '../Organizacion/OrganizacionForm';
import QueriesGenerales from "../QueriesGenerales";
import CajasOrganizaciones from './CajasOrganizaciones';
import Modal from 'react-bootstrap/Modal';
import '../Estilos/Modal.css';
import { buscarEnListaPorId } from '../Utilidades/ManejoLista';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

/*
Recibe los props:
soloVer: booleano para saber si solo se muestra un botón para
    visitar las asociaciones o los otros para modificar, eliminar
    y redireccionar a la junta directiva
 */
class Asociaciones extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            asociaciones: [],
            asociacion:{},
            muestraForm:false,
            muestraEliminar:false,
            mensajeModal:"",
        };
        this.asociacionesPedidas = false;
        this.avisaCreado = this.avisaCreado.bind(this);
        this.eliminarAsociacion = this.eliminarAsociacion.bind(this);
        this.muestraModal = this.muestraModal.bind(this);
    }

    /*
    muestraModal muestra el modal ya sea Form o Eliminar
    Parámetros:
    - nombre: string que se usa para saber cual modal abrir
    - muestra: booleano si es true muestra el modal sino lo cierra
    - asociacion: Objeto con los datos de la asociación solo
        necesario si se va a modificar o eliminar
    */
    muestraModal(nombre, muestra, asociacion){
        if(asociacion){
            if(asociacion.puestos){
                asociacion.puestos = [];
            }
        } else {
            asociacion={};
        }
        this.setState({
            asociacion,
            ["muestra"+nombre]:muestra,
        })
    }

    /*
    eliminarAsociacion hace lo que dice la quita de la interfaz
    */
    async eliminarAsociacion(){
        try{
            const id = this.state.asociacion.id;
            await this.queriesGenerales.eliminar("/organizacion/eliminar/"+id, {});
            const indice = buscarEnListaPorId(this.state.asociaciones, id);
            if(indice > -1){
                this.state.asociaciones.splice(indice, 1);
            }
            this.setState({
                mensajeModal: "¡Eliminado con éxito!",
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    cargarAsociaciones hace lo que dice las muestra
    */
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

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y  llama a
    cargar las asociaciones
    */
    componentDidMount() {
        document.title = "Asociaciones";
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
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Asociaciones</h1>
                    {this.props.soloVer ? <></>:
                    <button className="btn btn-primary" onClick={()=>this.muestraModal("Form", true)}><i className="lni lni-plus"></i>  Agregar asociación</button>}
                </div>
                <div className="row m-0">
                    <CajasOrganizaciones organizaciones={this.state.asociaciones} modificar={(asociacion)=>this.muestraModal("Form",true,asociacion)} eliminar={(asociacion)=>this.muestraModal("Eliminar", true,asociacion)} soloVer={this.props.soloVer} />
                </div>
                {this.props.soloVer ? <></>:
                    <>
                    <Modal size="lg" show={this.state.muestraForm} onHide={()=>this.muestraModal("Form",false)} className="modal-green" centered>
                    <Modal.Body>
                        <OrganizacionForm titulo={"Asociación"} avisaCreado={this.avisaCreado} campos={this.state.asociacion} cerrarModal={()=>this.muestraModal("Form",false)} />
                    </Modal.Body>
                    </Modal>
                    <Modal show={this.state.muestraEliminar} onHide={()=>this.muestraModal("Eliminar",false)} className="modal-green" centered>
                    <Modal.Body>
                        {this.state.mensajeModal === "" ?
                            <ConfirmaAccion claseBtn={"btn-danger"} titulo={"¿Desea eliminar a "+this.state.asociacion.nombre+"?"} accion={this.eliminarAsociacion} cerrarModal={()=>this.muestraModal("Eliminar",false)} accionNombre="Eliminar" />
                        :
                            <>
                                <h3 className="text-center">{this.state.mensajeModal}</h3>
                                <div className="d-flex justify-content-end">
                                    <div className="m-1">
                                        <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Eliminar",false)}>Volver</button>
                                    </div>
                                </div>
                            </>
                        }
                        
                    </Modal.Body>
                    </Modal>
                    </>
                    }
            </>
        );

        
    }
}

export default Asociaciones;