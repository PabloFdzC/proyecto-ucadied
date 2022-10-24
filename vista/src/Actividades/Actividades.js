import React from 'react';
import { Link } from 'react-router-dom';
import Tabla from '../Utilidades/Table/Table.jsx'
import QueriesGenerales from "../QueriesGenerales";
import Offcanvas from 'react-bootstrap/Offcanvas';
import {convertirHoraAMPM, fechaAHoraAMPM} from '../Utilidades/ManejoHoras';
import { Navigate } from "react-router-dom";
import {fechaAStringSlash} from '../Utilidades/ManejoFechas';
import '../Estilos/Offcanvas.css';
import {usuarioContexto} from '../usuarioContexto';

/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class Actividades extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            muestra:false,
            actividades: [],
            diaReservas: "",
            inmueble: {
                nombre:"",
                horario:[]
            },
            reservas: [],
        }
        this.actividadesPedidas = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Inmueble',selector:row=>row.inmuebles[0].nombre,sortable:true},
            {name:'Coordinador',selector:row=>row.coordinador,sortable:true},
            {name:'Email',selector:row=>row.email,sortable:true},
            {name:'Teléfonos',selector:row=>row.telefonos},
            ];
        this.titulosAnidados = [
            {name:'Día',selector:row=>row.diaBonito},
            {name:'Hora Inicio',selector:row=>row.inicio},
            {name:'Hora Final',selector:row=>row.final},
        ];
        this.titulosInmueble = [
            {name:'Día',selector:row=>{
                const dias = {
                    D:"Domingo",
                    L:"Lunes",
                    K:"Martes",
                    M:"Miércoles",
                    J:"Jueves",
                    V:"Viernes",
                    S:"Sábado",
                };
                return dias[row.dia]}},
            {name:'Hora Apertura',selector:row=>fechaAHoraAMPM(new Date(row.inicio), true)},
            {name:'Hora Cierre',selector:row=>fechaAHoraAMPM(new Date(row.final), true)},
        ];
        this.titulosReservas = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Hora Inicio',selector:row=>row.inicio},
            {name:'Hora Final',selector:row=>row.final},
        ];
        this.muestraOffcanvas = this.muestraOffcanvas.bind(this);
        this.verReservasHabilitadas = this.verReservasHabilitadas.bind(this);
    }

    /*
    acomodarDatos saca los datos del inmueble para que
    se puedan mostrar en la tabla como parte de la
    actividad
    
    Parámetros:
    - datos: Lista de objetos con la forma de actividad
        como el siguiente
        {
            id: número entero
            nombre: string,
            tipo: string,
            coordinador: string,
            email: string,
            telefonos: lista con números,
            inmuebles: lista con objetos de la forma
                {
                    id: número entero,
                    nombre: string,
                    horario: lista con objetos de la
                    forma {
                        dia: una letra que indica día,
                        inicio: string de la forma
                            número_entero:número_entero
                            por ejemplo 12:30,
                        final: string de la forma
                            número_entero:número_entero
                            por ejemplo 12:30,
                    },
                },
            reserva_inmuebles: lista con objetos de la forma
                {
                    inicio: string de fecha con la forma ISO,
                    final: string de fecha con la forma ISO,
                },
        }
    
    Salida:lista de objetos con la forma
        {
            id: número entero
            nombre: string,
            tipo: string,
            coordinador: string,
            email: string,
            telefonos: lista con números,
            inmuebles: este tiene la misma forma que el de
                entrada, pero se puede ignorar,
            inmueble: string con el nombre del inmueble,
            id_inmueble: número entero con el id del inmueble,
            reserva_inmuebles: lista con objetos de la forma
                {
                    dia: objeto Date con la fecha de inicio,
                    diaBonito: string con la fecha en forma
                        dd/mm/aaaa,
                    inicio: string con hora,
                    final: string con hora,
                },
        }
    */
    acomodarDatos(datos){
        const dias = ["D","L","K","M","J","V","S"];
        for(let i = 0; i < datos.length; i++){
            datos[i].inmueble = datos[i].inmuebles[0].nombre;
            datos[i].id_inmueble = datos[i].inmuebles[0].id;
            for(let j = 0; j < datos[i].reserva_inmuebles.length; j++){
                let fechaI = new Date(datos[i].reserva_inmuebles[j].inicio);
                let fechaF = new Date(datos[i].reserva_inmuebles[j].final);
                datos[i].reserva_inmuebles[j].dia = fechaI;
                datos[i].reserva_inmuebles[j].diaBonito = fechaAStringSlash(fechaI);
                datos[i].reserva_inmuebles[j].inicio = fechaAHoraAMPM(fechaI, true);
                datos[i].reserva_inmuebles[j].final = fechaAHoraAMPM(fechaF, true);
                let horario = [];
                for(let k = 0; k < datos[i].inmuebles[0].horario.length; k++){
                    if(datos[i].inmuebles[0].horario[k].dia === dias[fechaI.getDay()]){
                        horario.push(datos[i].inmuebles[0].horario[k]);
                        break;
                    }
                }
                datos[i].reserva_inmuebles[j].inmueble = {
                    nombre: datos[i].inmuebles[0].nombre,
                    horario:horario,
                };
            }
        }
        return datos;
    }

    acomodarDatosHabilitadas(datos){
        var resp = [];
        for(let i = 0; i < datos.length; i++){
            for(let j = 0; j < datos[i].reserva_inmuebles.length; j++){
                let fechaI = new Date(datos[i].reserva_inmuebles[j].inicio);
                let fechaF = new Date(datos[i].reserva_inmuebles[j].final);
                resp.push({
                    nombre:datos[i].nombre,
                    inicio: fechaAHoraAMPM(fechaI, true),
                    final: fechaAHoraAMPM(fechaF, true),
                })
            }
        }
        return resp;
    }
    
    /*
    cargarActividades hace lo que dice, carga la información
    de las actividades, pero solo las que no están habilitadas
    para mostrarlas en la tabla principal
    */
    async cargarActividades(habilitado, dia, mes, anio,id_inmueble){
        let params = {
            id_organizacion:this.props.idOrganizacion,
            habilitado:habilitado == undefined ? false : habilitado,
        };
        if(dia){
            params.dia = dia;
        }
        if(mes){
            params.mes = mes;
        }
        if(anio){
            params.anio = anio;
        }
        if(id_inmueble){
            params.id_inmueble = id_inmueble;
        }
        return await this.queriesGenerales.obtener("/actividad/consultar", params);
    }

    async cargarActividadesTablaPrincipal(){
        try{
            var resp = await this.cargarActividades(false);
            var actividades = this.acomodarDatos(resp.data);
            this.setState({
                actividades:this.state.actividades.concat(actividades),
            });
        }catch(err){
            console.log(err);
        }
    }

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar
    las actividades de la organización
    */
    async componentDidMount() {
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
        if(!this.actividadesPedidas){
            this.actividadesPedidas = true;
            this.cargarActividadesTablaPrincipal();
        }
    }

    /*
    muestraOffcanvas cambia el estado de muestra
    que se usa para mostrar el componente que
    aparece a un lado de la pantalla
    Parámetros:
    - muestra: booleano
    */
    muestraOffcanvas(muestra){
        this.setState({
            muestra:muestra,
        })
    }

    /*
    verReservasHabilitadas carga los datos de la tabla
    que está en el offcanvas muestrando las actividades
    del día según el que haya seleccionado el usuario
     */
    async verReservasHabilitadas(datosFila){
        let dia = datosFila.dia.getDate();
        let mes = datosFila.dia.getMonth()+1;
        let anio = datosFila.dia.getFullYear();
        var resp = await this.cargarActividades(true, dia, mes, anio, datosFila.id_inmueble);
        var actividades = this.acomodarDatosHabilitadas(resp.data,datosFila.dia);
        this.setState({
            reservas:actividades,
            muestra:true,
            inmueble:datosFila.inmueble,
            diaReservas: fechaAStringSlash(datosFila.dia),
        });
    }

    render(){
        const accionesAnidadas = [
            {
                className:"btn-secondary",
                onClick:this.verReservasHabilitadas,
                icon:"lni-calendar",
            },
        ];
        return (
            <usuarioContexto.Consumer>
                {({usuario, organizacion})=>{
                    if(usuario.tipo === "Usuario"){
                        return (
                            <>
                                <div className="d-flex align-items-center justify-content-between m-3">
                                    <div>
                                        <h1>Actividades</h1>
                                        <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
                                    </div>
                                    <Link className="btn btn-primary" to={"/calendarioActividades/"+this.props.idOrganizacion}><i className="lni lni-plus"></i>  Agregar actividad</Link>
                                </div>
                                <div className="d-flex" style={{height:"inherit"}}>
                                    <div className="w-100" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                                        <Tabla titulos={this.titulos} titulosAnidados={this.titulosAnidados} valorAnidado={"reserva_inmuebles"} datos={this.state.actividades} accionesAnidadas={accionesAnidadas} />
                                    </div>
                                </div>
                                <Offcanvas className="offcanvas-green" show={this.state.muestra} onHide={()=>this.muestraOffcanvas(false)}>
                                    <Offcanvas.Body>
                                        <h3>Horario de {this.state.inmueble.nombre}</h3>
                                        <Tabla titulos={this.titulosInmueble} datos={this.state.inmueble.horario} style={{color:"#FFFFFF"}} />
                                        <h3>Reservas habilitadas el día {this.state.diaReservas}</h3>
                                        <Tabla titulos={this.titulosReservas} datos={this.state.reservas ? this.state.reservas : []} style={{color:"#FFFFFF"}} />
                                    </Offcanvas.Body>
                                </Offcanvas>
                            </>
                        );
                    } else {
                        return <Navigate to='/iniciarSesion' replace={true}/>;
                    }
                }}
            </usuarioContexto.Consumer>
        );
    }
}

export default Actividades;