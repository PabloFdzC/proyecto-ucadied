import React from 'react';
import { Link } from 'react-router-dom';
import Tabla from '../Utilidades/Tabla.js'
import QueriesGenerales from "../QueriesGenerales";
import Offcanvas from 'react-bootstrap/Offcanvas';
import '../Estilos/Offcanvas.css';

/*
Recibe los props:
id: es el id de la organización en la que se encuentra actualmente
 */
class Actividades extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            muestra:false,
            actividades: [],
            inmueble: {
                nombre:"Mi inmueble",
                horario:[{
                    dia:"L",
                    inicio:"10:10",
                    final:"10:15",
                }]
            },
            reservas: [{
                nombre: "Mi actividad",
                inicio: "10:30",
                final: "10:50",
            },
            {
                nombre: "Mi actividad",
                inicio: "10:30",
                final: "10:50",
            }],
        }
        this.actividadesPedidas = false;
        this.titulos = [
            {llave:"nombre",valor:"Nombre"},
            {llave:"inmueble",valor:"Inmueble"},
            {llave:"coordinador",valor:"Coordinador"},
            {llave:"email",valor:"Email"},
            {llave:"telefonos",valor:"Teléfonos"},
        ];
        this.titulosAnidados = [
            {llave:"dia",valor:"Día"},
            {llave:"inicio",valor:"Hora Inicio"},
            {llave:"final",valor:"Hora Final"},
        ];
        this.titulosInmueble = [
            {llave:"inicio",valor:"Hora Apertura"},
            {llave:"final",valor:"Hora Cierre"},
        ];
        this.titulosReservas = [
            {llave:"nombre",valor:"Nombre"},
            {llave:"inicio",valor:"Hora Inicio"},
            {llave:"final",valor:"Hora Final"},
        ];
        this.muestraOffcanvas = this.muestraOffcanvas.bind(this);
    }

    // acomodarDatos saca los datos del inmueble para que
    // se puedan mostrar en la tabla
    acomodarDatos(datos){
        for(let i = 0; i < datos.length; i++){
            datos[i].inmueble = datos[i].inmuebles[0].nombre;
            datos[i].id_inmueble = datos[i].inmuebles[0].id;
        }
        return datos;
    }
    
    // cargarActividades hace lo que dice, carga la información
    // de las actividades, pero solo las que no están habilitadas
    // para mostrarlas en la tabla principal
    async cargarActividades(){
        try{
            const resp = await this.queriesGenerales.obtener("/actividad/consultar", {
                id_organizacion:this.props.id,
                habilitado:false,
            });
            var actividades = this.acomodarDatos(resp.data);
            this.setState({
                actividades:this.state.actividades.concat(actividades),
            });
        } catch(err){
            console.log(err);
        }
    }

    // componentDidMount es una función de react que
    // se llama antes de hacer el render y carga las
    // actividades
    componentDidMount() {
        if(!this.actividadesPedidas){
            this.actividadesPedidas = true;
            this.cargarActividades();
        }
    }

    // muestraOffcanvas cambia el estado de muestra
    // que se usa para mostrar el componente que
    // aparece a un lado de la pantalla
    muestraOffcanvas(muestra){
        this.setState({
            muestra:muestra,
        })
    }

    render(){
        return (
            <>
                <div className="d-flex align-items-center justify-content-between m-3">
                    <h1>Actividades</h1>
                    <Link className="btn btn-primary" to={"/calendarioActividades/"+this.props.id}><i className="lni lni-plus"></i>  Agregar actividad</Link>
                </div>
                <div className="d-flex" style={{height:"inherit"}}>
                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                        <Tabla titulos={this.titulos} titulosAnidados={this.titulosAnidados} datos={this.state.actividades} style={{color:"#FFFFFF"}} />
                    </div>
                </div>
                <Offcanvas className="offcanvas-green" show={this.state.muestra} onHide={()=>this.muestraOffcanvas(false)}>
                    <Offcanvas.Body>
                        <h3>Horario de {this.state.inmueble.nombre}</h3>
                        <Tabla titulos={this.titulosInmueble} datos={this.state.inmueble.horario} style={{color:"#FFFFFF"}} />
                        <h3>Reservas habilitadas</h3>
                        <Tabla titulos={this.titulosReservas} datos={this.state.reservas} style={{color:"#FFFFFF"}} />
                    </Offcanvas.Body>
                </Offcanvas>
            </>
        );
    }
}

export default Actividades;