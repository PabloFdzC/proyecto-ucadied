import React from 'react';
import { Route, Routes, BrowserRouter, Navigate } from 'react-router-dom';

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
    const usuario = {
      id_usuario: localStorage.getItem("id_usuario"),
      tipo: localStorage.getItem("tipo"),
    };
    this.state = {
      usuario:{
        tipo:usuario.tipo ? usuario.tipo : "",
        id_usuario: usuario.id_usuario ? usuario.id_usuario : -1
      },
      organizacionActual:orgActual ? orgActual : -1
    }
    this.organizacionesPedidos = false;

    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }

  async iniciarSesion(usuario) {
    console.log(usuario);
    localStorage.setItem("id_usuario", usuario.id_usuario);
    localStorage.setItem("tipo", usuario.tipo);
    this.setState({usuario: usuario});
    console.log("localStorage.getItem(id_usuario):");
    console.log(localStorage.getItem("id_usuario"));
    console.log("localStorage.getItem(tipo):");
    console.log(localStorage.getItem("tipo"));
  }

  cerrarSesion() {
    localStorage.removeItem("id_usuario");
    localStorage.removeItem("tipo");
    this.setState({usuario: {
      tipo:"",
      id_usuario: -1
    }});
  }

  async cargarOrganizaciones(){
    try{
        const resp = await this.queriesGenerales.obtener("/organizacion/consultar", {});
        console.log(resp.data);
        if(resp.data.length > 0){
          this.actualizaOrganizacionActual(resp.data[0].id)
        }
    } catch(err){
        console.log(err);
    }
  }

  actualizaOrganizacionActual(id){
    if(id != -1 && id){
      this.setState({
          organizacionActual:id,
      });
    }
  }

  componentDidMount() {
    const orgActual = localStorage.getItem("organizacionActual");
    const usuario = {
      id_usuario: localStorage.getItem("id_usuario"),
      tipo: localStorage.getItem("tipo"),
    };
    console.log("usuario.id");
    console.log(usuario.id_usuario);
    if(usuario.id_usuario){
      this.setState({usuario: usuario});
    }
    if(!isNaN(orgActual) && orgActual != this.state.organizacionActual){
      this.actualizaOrganizacionActual(orgActual);
    } else if(!this.organizacionesPedidos){
      this.organizacionesPedidos = true;
      this.cargarOrganizaciones();
    }
  }

  render(){
    const autenticacion = {
      usuario: this.state.usuario,
      organizacionActual:this.state.organizacionActual,
      cerrarSesionUsuario: this.cerrarSesion,
      iniciarSesionUsuario: this.iniciarSesion,
    };

    console.log(this.state.organizacionActual);

    return (
      <usuarioContexto.Provider value={autenticacion}>
        <BrowserRouter>
          <Navegacion organizacionActual={this.state.organizacionActual} />
          <Routes>
              <Route path="/" element={<ResuelvePrincipal ruta={this.state.organizacionActual != -1 ? "/principal/"+this.state.organizacionActual : ""} replace />}></Route>
              <Route path="/principal/:id" element={<ConParams app={this} componente={<Principal />}/> } />
              <Route path="/iniciarSesion" element={<IniciarSesion />} />
              <Route path="/presidencia/juntaDirectiva/:id" element={<ConParams app={this}  componente={<JuntaDirectiva />}/>} />
              <Route path="/presidencia/afiliados/:id" element={<ConParams app={this} componente={<Afiliados />} />} />
              <Route path="/presidencia/asociaciones/" element={<Asociaciones soloVer={false}/>} />
              
              
              <Route path="/administradores" element={<Administradores />} />
              <Route path="/unionCantonal" element={<UnionCantonal />} />
              <Route path="/asociaciones" element={<Asociaciones soloVer={ this.state.usuario.tipo != "Administrador" } />} />
              <Route path="/usuarios" element={<Usuarios />} />
            </ Routes>
        </BrowserRouter>
      </usuarioContexto.Provider>
    );
  }
}

export default App;
