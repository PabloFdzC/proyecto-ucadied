import React from 'react';
import ActividadForm from './ActividadForm';
import Tabla from '../Utilidades/Tabla.js'
import QueriesGenerales from "../QueriesGenerales";
import Modal from 'react-bootstrap/Modal';
import manejarCambio from '../Utilidades/manejarCambio';
import Calendar from '../Utilidades/Calendario/Calendar.jsx';

/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class CalendarioActividades extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            inmuebles: [],
            actividades: [],
            campos:{
                id_inmueble:"",
            },
        }
        this.actividadesPedidas = false;
        this.muestraModal = this.muestraModal.bind(this);
    }

    
    async cargarActividades(){
        try{
            const resp = await this.queriesGenerales.obtener("/actividad/consultar", {
                id_organizacion:this.props.idOrganizacion,
                id_inmueble:this.state.id_inmueble,
            });
            this.setState({
                actividades:this.state.actividades.concat(resp.data),
            });
        } catch(err){
            console.log(err);
        }
    }

    async cargarInmuebles(){
        try{
            const resp = await this.queriesGenerales.obtener("/inmueble/consultar", {
                id_organizacion:this.props.idOrganizacion,
            });
            this.setState({
                inmuebles:this.state.inmuebles.concat(resp.data),
                campos:Object.assign({}, this.state.campos,{
                    id_inmueble:resp.data[0].id.toString(),
                }),
            });
        } catch(err){
            console.log(err);
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente y llama a cargar los inmuebles
    */
    async componentDidMount() {
        document.title = "Calendario Actividades";
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
        if(!this.inmueblesPedidos){
            this.inmueblesPedidos = true;
            this.cargarInmuebles();
        }
    }

    agregarActividad(){
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

    /*
    Se llama a la función manejarCambio que actualiza el
    estado con los valores de campos en el formulario
    */
    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    render(){
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Actividades</h1>
                    <div className="mb-3 position-relative">
                        <label htmlFor="id_inmueble" className="form-label">Inmueble</label>
                        <select type="text" className="form-select" key="id_inmueble" name="id_inmueble" value={this.state.campos.id_inmueble} onChange={this.manejaCambio} >
                            {this.state.inmuebles.map((inmueble, i)=><option key={i} value={inmueble.id}>{inmueble.nombre}</option>)}
                        </select>
                    </div>
                    <button className="btn btn-primary" onClick={()=>this.muestraModal(true)}><i className="lni lni-plus"></i>  Agregar actividad</button>
                </div>
                <div className="d-flex" style={{height:"inherit"}}>
                    <Calendar style={{width:"100%"}} />
                </div>
                <Modal size="lg" show={this.state.muestra} onHide={()=>this.muestraModal(false)} className="modal-green">
                <Modal.Body>
                    <ActividadForm actividad={true}  cerrarModal={()=>this.muestraModal(false)} idInmueble={this.state.campos.id_inmueble} idOrganizacion={this.props.idOrganizacion} inmuebles={this.state.inmuebles} />
                </Modal.Body>
                </Modal>
            </>
        );
    }
}

export default CalendarioActividades;