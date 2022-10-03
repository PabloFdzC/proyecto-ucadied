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
import OrganizacionForm from './Organizacion/OrganizacionForm';
import Proyectos from './Proyecto/Proyectos';
import Gastos from './Proyecto/Gastos';

function ConParams(props) {
  const { id } = useParams();
  localStorage.setItem("organizacionActual", id);
  return <>{React.cloneElement(props.componente,
    {id:id})}</>;
}


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

  cerrarSesion() {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("tipo");
    this.setState({usuario: {
      tipo:"",
      id_usuario: -1
    }});
  }

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

  async cargarOrganizacion(id){
    console.log(this.state.organizacion);
    console.log(this.state.organizacion.cedula == "");
    if(id !== this.state.organizacion.id || this.state.organizacion.cedula == ""){
      const resp = await this.queriesGenerales.obtener("/organizacion/consultar/"+id, {});
      console.log(resp);
      if(resp.data.length > 0){
        this.actualizaOrganizacionActual(resp.data[0]);
      }
    }
  }

  actualizaOrganizacionActual(organizacion){
    if(organizacion.id && organizacion.id !== -1 && organizacion.id !== this.state.organizacion.id){
      localStorage.setItem("organizacionActual", organizacion.id);
      localStorage.setItem("organizacionPertenece", organizacion.id_organizacion);
      this.setState({
          organizacion:organizacion,
      });
    }
  }

  componentDidMount() {
    if(this.state.organizacion.id === -1){
      if(!this.unionPedida){
        this.unionPedida = true;
        this.cargarUnion();
      }
    }
  }

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
              
              <Route path="/administradores" element={<Administradores />} />
              <Route path="/unionCantonal" element={<UnionCantonal />} />
              <Route path="/asociaciones" element={<Asociaciones soloVer={ this.state.usuario.tipo !== "Administrador" } />} />
              <Route path="/usuarios" element={<Usuarios />} />
              <Route path="/prueba" element={
                <div className="modal" id="agregarAsociacionModal" tabIndex="-1" aria-labelledby="modalAgregarUnion">
                  <div className="modal-dialog modal-dialog-scrollable modal-lg">
                    <div className="modal-content p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                      <div className="modal-body">
                        <OrganizacionForm ingresaJunta={true} titulo="Asociación" />
                      </div>
                    </div>
                  </div>
                </div>
              } />
            </ Routes>
        </BrowserRouter>
      </usuarioContexto.Provider>
    );
  }
}

export default App;
