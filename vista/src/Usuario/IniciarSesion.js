import React from 'react';
import IniciarSesionForm from './IniciarSesionForm';
import logoUcadied from '../Imagenes/logo-UCADIED.png';

class IniciarSesion extends React.Component{

    componentDidMount(){
      document.title = "Iniciar Sesión";
    }

    render(){
        return (
          <div className="row m-0" style={{height:"inherit"}}>
            <div className="col d-flex align-items-center">
              <div className="text-center w-100">
                <img src={logoUcadied} className="align-middle" alt="logo" />
              </div>
            </div>
            <div className="col d-flex align-items-center" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
              <div className="container p-5">
                <h2 className="text-center">Iniciar Sesión</h2>
                <IniciarSesionForm />
              </div>
              
            </div>
          </div>
          
        );
    }
}

export default IniciarSesion;