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

import './Estilos/Botones.css';
import Usuarios from './Administrador/Usuarios';



class App extends React.Component {

  constructor(props){
    super(props);
    this.queriesGenerales = new QueriesGenerales();
    this.state = {
      usuario:{
        tipo:"",
        id_usuario: -1
      }
    }

    this.iniciarSesion = this.iniciarSesion.bind(this);
    this.cerrarSesion = this.cerrarSesion.bind(this);
  }

  async iniciarSesion(usuario) {
    await this.setState({usuario: usuario});
  }

  cerrarSesion() {
    this.setState({usuario: {
      tipo:"",
      organizacion:"",
      id_usuario: -1
    }});
  }

  render(){
    const autenticacion = {
      usuario: this.state.usuario,
      cerrarSesionUsuario: this.cerrarSesion,
      iniciarSesionUsuario: this.iniciarSesion,
    }

    return (
      <usuarioContexto.Provider value={autenticacion}>
        <BrowserRouter>
          <Navegacion />
          <Routes>
              <Route path="/" element={<Navigate to="/principal" replace />}></Route>
              <Route path="/principal" element={<Principal/>} />
              <Route path="/iniciarSesion" element={<IniciarSesion />} />
              <Route path="/presidencia/juntaDirectiva" element={<JuntaDirectiva />} />
              <Route path="/presidencia/afiliados" element={<Afiliados />} />
              <Route path="/presidencia/asociaciones" element={<Asociaciones soloVer={false}/>} />
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
