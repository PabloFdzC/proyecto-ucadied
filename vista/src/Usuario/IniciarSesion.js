import React from 'react';
import IniciarSesionForm from './IniciarSesionForm';
import logoUcadied from '../Imagenes/logo-UCADIED.png';

class IniciarSesion extends React.Component{
    render(){
        return (
          <div className="row">
            <div className="col-6">
              <div className="d-flex align-items-center justify-content-center">
                <img src={logoUcadied} className="mx-auto" alt="logo" />
              </div>
            </div>
            <div className="col-6">
              <div className="container m-auto" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                <h2 className="text-center">Iniciar Sesión</h2>
                <IniciarSesionForm />
              </div>
            </div>
          </div>
        );
    }
}

export default IniciarSesion;