import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import IniciarSesion from './Usuario/IniciarSesion';
import Navegacion from './Utilidades/Navegacion';
import JuntaDirectiva from './Organizacion/JuntaDirectiva';
import Afiliados from './Usuario/Afiliados';
import Asociaciones from './Organizacion/Asociaciones';
import Administradores from './Administrador/Administradores';
import QueriesGenerales from "./QueriesGenerales";
import UnionCantonal from './Administrador/UnionCantonal';

import {usuarioContexto} from './usuarioContexto';
import Principal from './Organizacion/Principal';
import ResuelvePrincipal from './Utilidades/ResuelvePrincipal';

import './Estilos/Botones.css';
import Usuarios from './Administrador/Usuarios';

import { useParams } from "react-router-dom";
import Proyectos from './Proyecto/Proyectos';
import Gastos from './Proyecto/Gastos';
import Inmuebles from './Inmueble/Inmuebles';
import CalendarioActividades from './Actividades/CalendarioActividades';
import Actividades from './Actividades/Actividades';

import Table from './Utilidades/Table/Table.jsx';

// Esta función es necesaria para pasarle el parámetro
// id de la url a los componentes que la necesitan
// ya que react-router-dom tiene una función para
// obtenerlo, pero esta solo funciona con hooks
// y los hooks no se pueden llamar dentro de las
// clases
function ConParams(props) {
  const { id } = useParams();
  return <>{React.cloneElement(props.componente,
    {id:id})}</>;
}

/*
No recibe props
 */
class App extends React.Component {

  constructor(props){
    super(props);
    this.queriesGenerales = new QueriesGenerales();
    const orgActual = localStorage.getItem("organizacionActual");
    const orgPertenece = localStorage.getItem("organizacionPertenece");
    const usuario = {
      id_usuario: localStorage.getItem("id_usuario"),
      tipo: localStorage.getItem("tipo"),
      id_organizacion: localStorage.getItem("id_organizacion"),
    };
    // En el estado se mantiene la información del usuario
    // que esté usando el sistema actualmente, la organización
    // de la que se debe mostrar la información
    this.state = {
      usuario:{
        tipo:usuario.tipo ? usuario.tipo : "",
        id_usuario: usuario.id_usuario ? usuario.id_usuario : -1,
      },
      organizacion:{
        id:orgActual ? orgActual : -1,
        id_organizacion: orgPertenece ? orgPertenece : -1,
        cedula: "",
        nombre: "",
        domicilio: "",
        territorio: "",
        telefonos: "",
        email: "",
        n_miembros_jd: "",
        forma_elegir_jd: "",
      },
      proyecto:{
        id:-1,
        nombre:"",
      }
    }
    this.unionPedida = false;

    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);
    this.cargarOrganizacion = this.cargarOrganizacion.bind(this);
    this.escogeProyecto = this.escogeProyecto.bind(this);
  }
  
  // iniciarSesion se usa para actualizar el usuario
  // que actualmente inició sesión, se le pasa
  // como contexto a los demás componentes
  async iniciarSesion(usuario) {
    localStorage.setItem("id_usuario", usuario.id_usuario);
    localStorage.setItem("tipo", usuario.tipo);
    localStorage.setItem("organizacionActual", usuario.organizacion.id);
    localStorage.setItem("organizacionPertenece", usuario.organizacion.id_organizacion);
    
    this.setState({
      usuario: {
        id_usuario:usuario.id_usuario,
        tipo:usuario.tipo,
      },
      organizacion: usuario.organizacion ? usuario.organizacion : this.state.organizacion,
    });
  }

  // cerrarSesion se usa para actualizar el usuario
  // que actualmente cerró sesión, se le pasa
  // como contexto a los demás componentes
  cerrarSesion() {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("tipo");
    this.setState({usuario: {
      tipo:"",
      id_usuario: -1
    }});
  }

  // cargarUnion obtiene la información de las uniones
  // cantonales y se escoge la primera que aparezca
  // para que sea la organización que se está viendo
  // actualmente
  async cargarUnion(){
    try{
        const resp = await this.queriesGenerales.obtener("/organizacion/consultarTipo/1", {});
        if(resp.data.length > 0){
          this.actualizaOrganizacionActual(resp.data[0])
        }
    } catch(err){
        console.log(err);
    }
  }

  // cargarOrganizacion obtiene la información de la 
  // organización según se le pase el id, se le pasa
  // como prop a los componentes que pueden cambiar
  // de organización según el id que tengan en la
  // url y se pone en este componente para poder
  // reutilizarla en los demás
  async cargarOrganizacion(id){
    if(id !== this.state.organizacion.id || this.state.organizacion.cedula === ""){
      const resp = await this.queriesGenerales.obtener("/organizacion/consultar/"+id, {});
      console.log(resp);
      if(resp.data.length > 0){
        this.actualizaOrganizacionActual(resp.data[0]);
      }
    }
  }

  // actualizaOrganizacionActual cambia los datos en 
  // el localstorage de la organización y cambia el estado
  // para saber cuál es la organización actual.
  // Es necesario guardarlo en el localStorage porque si
  // se recarga la página (en una de las que no tienen id
  // en la url) no se sabría cuál es la organización actual
  actualizaOrganizacionActual(organizacion){
    if(organizacion.id && organizacion.id !== -1 && organizacion.id !== this.state.organizacion.id){
      localStorage.setItem("organizacionActual", organizacion.id);
      localStorage.setItem("organizacionPertenece", organizacion.id_organizacion);
      this.setState({
          organizacion:organizacion,
      });
    }
  }

  // componentDidMount es una función que trae
  // react que se llama antes de llamar a render
  // aquí se usa para pedir la unión cantonal en
  // caso de que no haya ninguna organización actual
  componentDidMount() {
    if(this.state.organizacion.id === -1){
      if(!this.unionPedida){
        this.unionPedida = true;
        this.cargarUnion();
      }
    }
  }

  // escogeProyecto simplemente cambia el estado
  // de proyecto para saber cuál se está viendo
  // actualmente
  escogeProyecto(proyecto){
    this.setState({
      proyecto:proyecto,
    });
  }

  render(){
    const autenticacion = {
      usuario: this.state.usuario,
      organizacion:this.state.organizacion,
      cerrarSesionUsuario: this.cerrarSesion,
      iniciarSesionUsuario: this.iniciarSesion,
    };

    return (
      <usuarioContexto.Provider value={autenticacion}>
        <BrowserRouter>
          <Navegacion />
          <Routes>
              <Route path="/" element={<ResuelvePrincipal ruta={this.state.organizacion.id !== -1 ? "/principal/"+this.state.organizacion.id : ""} replace />}></Route>
              <Route path="/principal/:id" element={<ConParams app={this} componente={<Principal />}/> } />
              <Route path="/iniciarSesion" element={<IniciarSesion />} />
              <Route path="/presidencia/juntaDirectiva/:id" element={<ConParams app={this}  componente={<JuntaDirectiva cargarOrganizacion={this.cargarOrganizacion} />}/>} />
              <Route path="/presidencia/afiliados/:id" element={<ConParams app={this} componente={<Afiliados cargarOrganizacion={this.cargarOrganizacion} />} />} />
              <Route path="/presidencia/asociaciones/" element={<Asociaciones soloVer={false}/>} />
              <Route path="/proyectos/:id" element={<ConParams app={this}  componente={<Proyectos escogeProyecto={this.escogeProyecto} cargarOrganizacion={this.cargarOrganizacion} />}/>} />
              <Route index path="/proyectos/:id/gastos/:id" element={<ConParams app={this}  componente={<Gastos idProyecto={this.state.proyecto.id} nombreProyecto={this.state.proyecto.nombre} />}/>} />
              <Route path="/inmuebles/:id" element={<ConParams app={this}  componente={<Inmuebles cargarOrganizacion={this.cargarOrganizacion} />}/>} />
              <Route path="/calendarioActividades/:id" element={<ConParams app={this}  componente={<CalendarioActividades cargarOrganizacion={this.cargarOrganizacion} />}/>} />
              <Route path="/actividades/:id" element={<ConParams app={this}  componente={<Actividades cargarOrganizacion={this.cargarOrganizacion} />}/>} />
              
              <Route path="/administradores" element={<Administradores />} />
              <Route path="/unionCantonal" element={<UnionCantonal />} />
              <Route path="/asociaciones" element={<Asociaciones soloVer={ this.state.usuario.tipo !== "Administrador" } />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/prueba" element={
                <Table/>
              } />
            </ Routes>
        </BrowserRouter>
      </usuarioContexto.Provider>
    );
  }
}

export default App;
