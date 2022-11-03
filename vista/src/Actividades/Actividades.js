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
import Modal from 'react-bootstrap/Modal';
import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

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
            Actividad:{},
            muestraHabilitarActividad:false,
            muestraEliminarActividad:false,
            Reserva:{},
            muestraHabilitarReserva:false,
            muestraEliminarReserva:false,
            actividades: [],
            diaReservas: "",
            inmueble: {
                nombre:"",
                horario:[]
            },
            reservas: [],
            mensajeModal: "",
        }
        this.actividadesPedidas = false;
        this.titulos = [
            {name:'Nombre',selector:row=>row.nombre,sortable:true},
            {name:'Inmueble',selector:row=>row.inmuebles[0].nombre,sortable:true},
            {name:'Persona de contacto',selector:row=>row.persona_contacto,sortable:true},
            {name:'Email',selector:row=>row.email,sortable:true},
            {name:'Teléfonos',selector:row=>row.telefonos},
            ];
        this.titulosAnidados = [
            {name:'Día',selector:row=>row.diaBonito},
            {name:'Hora Inicio',selector:row=>row.inicioBonito},
            {name:'Hora Final',selector:row=>row.finalBonito},
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
            {name:'Hora Inicio',selector:row=>row.inicioBonito},
            {name:'Hora Final',selector:row=>row.finalBonito},
        ];
        this.muestraOffcanvas = this.muestraOffcanvas.bind(this);
        this.verReservasHabilitadas = this.verReservasHabilitadas.bind(this);
        this.habilitarReservas = this.habilitarReservas.bind(this);
        this.eliminarReservas = this.eliminarReservas.bind(this);
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
            persona_contacto: string,
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
            persona_contacto: string,
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
                datos[i].reserva_inmuebles[j].inicioBonito = fechaAHoraAMPM(fechaI, true);
                datos[i].reserva_inmuebles[j].finalBonito = fechaAHoraAMPM(fechaF, true);
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
                    inicio: datos[i].reserva_inmuebles[j].inicio,
                    final: datos[i].reserva_inmuebles[j].final,
                    inicioBonito: fechaAHoraAMPM(fechaI, true),
                    finalBonito: fechaAHoraAMPM(fechaF, true),
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

    muestraModal(nombre, accion, muestra, valor){
        if(!valor) valor={};
        this.setState({
            [nombre]:valor,
            ["muestra"+accion+nombre]:muestra,
            mensajeModal: muestra ? "" :  this.state.mensajeModal,
        })
    }

    async habilitarReservas(){
        var datos;
        if(Object.keys(this.state.Reserva).length > 0){
            datos = {
                id_inmueble: this.state.Reserva.id_inmueble,
                dias: [{
                    id:this.state.Reserva.id,
                    inicio:this.state.Reserva.inicio,
                    final:this.state.Reserva.final,
                }]
            };
        } else if(Object.keys(this.state.Actividad).length > 0){
            datos = {
                id_inmueble: this.state.Actividad.id_inmueble,
                dias: this.state.Actividad.reserva_inmuebles,
            };
        }
        if(datos){
            try{
                const resp = await this.queriesGenerales.postear("/actividad/habilitarReservas", datos);
                this.setState({
                    mensajeModal: "¡Habilitada con éxito!",
                });
                this.eliminaElementoTablaPrincipal();
            } catch(error){
                if(error.response.data.errores){
                    if(error.response.data.errores.length > 1){
                        this.setState({
                            mensajeModal: "No se puede habilitar, ya hay reservas habilitadas en esos horarios.",
                        });
                    } else {
                        this.setState({
                            mensajeModal: "No se puede habilitar la reserva, ya hay reservas habilitadas en ese horario.",
                        });
                    }
                }
                console.log(error);
            }
        }
        
    }

    eliminaElementoTablaPrincipal(){
        var actividades = this.state.actividades;
        if(Object.keys(this.state.Reserva).length > 0){
            for(let i = 0; i < actividades.length; i++){
                if(actividades[i].id === this.state.Reserva.id_actividad){
                    for(let j = 0; j < actividades[i].reserva_inmuebles.length; j++){
                        if(actividades[i].reserva_inmuebles[j].id === this.state.Reserva.id){
                            actividades[i].reserva_inmuebles.splice(j, 1);
                            if(actividades[i].reserva_inmuebles.length === 0){
                                actividades.splice(i, 1);
                            }
                            this.setState({});
                            break;
                        }
                    }
                    break;
                }
            }
        } else if(Object.keys(this.state.Actividad).length > 0){
            for(let i = 0; i < actividades.length; i++){
                if(actividades[i].id === this.state.Actividad.id){
                    actividades.splice(i, 1);
                    this.setState({});
                    break;
                }
            }
        }
    }

    async eliminarReservas(){
        if(Object.keys(this.state.Reserva).length > 0){
            try{
                const resp = await this.queriesGenerales.eliminar("/actividad/eliminarReserva/"+this.state.Reserva.id, {});
                this.setState({
                    mensajeModal: "¡Eliminada con éxito!",
                });
                this.eliminaElementoTablaPrincipal();
            } catch(error){
                console.log(error);
            }
        } else if(Object.keys(this.state.Actividad).length > 0){
            try{
                const resp = await this.queriesGenerales.eliminar("/actividad/eliminarReservasInhabilitadas/"+this.state.Actividad.id, {});
                this.setState({
                    mensajeModal: "¡Eliminada con éxito!",
                });
                this.eliminaElementoTablaPrincipal();
            } catch(error){
                console.log(error);
            }
        }
        
    }

    render(){
        const acciones = [
            {
                nombre: "Habilitar",
                className:"btn-primary",
                onClick:(valor)=>this.muestraModal("Actividad", "Habilitar",true, valor),
                icon:"lni-checkmark-circle",
            },
            {
                nombre: "Eliminar",
                className:"btn-danger",
                onClick:(valor)=>this.muestraModal("Actividad", "Eliminar",true, valor),
                icon:"lni-trash-can",
            },
        ];
        const accionesAnidadas = [
            {
                nombre:"Habilitar",
                className:"btn-primary",
                onClick:(valor)=>this.muestraModal("Reserva", "Habilitar",true, valor),
                icon:"lni-checkmark-circle",
            },
            {
                nombre:"Ver Habilitadas",
                className:"btn-secondary",
                onClick:this.verReservasHabilitadas,
                icon:"lni-calendar",
            },
            {
                nombre:"Eliminar",
                className:"btn-danger",
                onClick:(valor)=>this.muestraModal("Reserva", "Eliminar",true, valor),
                icon:"lni-trash-can",
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
                                        <Tabla titulos={this.titulos} titulosAnidados={this.titulosAnidados} valorAnidado={"reserva_inmuebles"} datos={this.state.actividades} accionesAnidadas={accionesAnidadas} acciones={acciones} />
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
                                <Modal show={this.state.muestraHabilitarActividad} onHide={()=>this.muestraModal("Actividad", "Habilitar",false)} className="modal-green" centered>
                                <Modal.Body>
                                    {this.state.mensajeModal === "" ?
                                    <ConfirmaAccion claseBtn={"btn-primary"} accionNombre="Habilitar" titulo={"¿Desea habilitar todas las reservas para "+this.state.Actividad.nombre+"?"} accion={this.habilitarReservas} cerrarModal={()=>this.muestraModal("Actividad", "Habilitar",false)} />
                                    :
                                    <>
                                        <h3 className="text-center">{this.state.mensajeModal}</h3>
                                        <div className="d-flex justify-content-end">
                                            <div className="m-1">
                                                <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Actividad", "Habilitar",false)}>Volver</button>
                                            </div>
                                        </div>
                                    </>}
                                </Modal.Body>
                                </Modal>
                                <Modal show={this.state.muestraHabilitarReserva} onHide={()=>this.muestraModal("Reserva", "Habilitar",false)} className="modal-green" centered>
                                <Modal.Body>
                                    {this.state.mensajeModal === "" ?
                                    <ConfirmaAccion claseBtn={"btn-primary"} accionNombre="Habilitar" titulo={"¿Desea habilitar la reserva del "+this.state.Reserva.diaBonito+ " de " +this.state.Reserva.inicioBonito+"-"+this.state.Reserva.finalBonito+"?"} accion={this.habilitarReservas} cerrarModal={()=>this.muestraModal("Actividad", "Habilitar",false)} />
                                    :
                                    <>
                                        <h3 className="text-center">{this.state.mensajeModal}</h3>
                                        <div className="d-flex justify-content-end">
                                            <div className="m-1">
                                                <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Reserva", "Habilitar",false)}>Volver</button>
                                            </div>
                                        </div>
                                    </>}
                                </Modal.Body>
                                </Modal>
                                <Modal show={this.state.muestraEliminarActividad} onHide={()=>this.muestraModal("Actividad", "Eliminar",false)} className="modal-green" centered>
                                <Modal.Body>
                                    {this.state.mensajeModal === "" ?
                                    <ConfirmaAccion claseBtn={"btn-danger"} accionNombre="Eliminar" titulo={"¿Desea eliminar las reservas para "+this.state.Actividad.nombre+" que no hayan sido habilitadas?"} accion={this.eliminarReservas} cerrarModal={()=>this.muestraModal("Actividad", "Eliminar",false)} />
                                    :
                                    <>
                                        <h3 className="text-center">{this.state.mensajeModal}</h3>
                                        <div className="d-flex justify-content-end">
                                            <div className="m-1">
                                                <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Actividad", "Eliminar",false)}>Volver</button>
                                            </div>
                                        </div>
                                    </>}
                                </Modal.Body>
                                </Modal>
                                <Modal show={this.state.muestraEliminarReserva} onHide={()=>this.muestraModal("Reserva", "Eliminar",false)} className="modal-green" centered>
                                <Modal.Body>
                                    {this.state.mensajeModal === "" ?
                                    <ConfirmaAccion claseBtn={"btn-danger"} accionNombre="Eliminar" titulo={"¿Desea eliminar la reserva del "+this.state.Reserva.diaBonito+ " de " +this.state.Reserva.inicioBonito+"-"+this.state.Reserva.finalBonito+"?"} accion={this.eliminarReservas} cerrarModal={()=>this.muestraModal("Actividad", "Eliminar",false)} />
                                    :
                                    <>
                                        <h3 className="text-center">{this.state.mensajeModal}</h3>
                                        <div className="d-flex justify-content-end">
                                            <div className="m-1">
                                                <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>this.muestraModal("Reserva", "Eliminar",false)}>Volver</button>
                                            </div>
                                        </div>
                                    </>}
                                </Modal.Body>
                                </Modal>
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