import React from 'react';
import logoUcadied from '../Imagenes/logo-UCADIED.png';
import Contactenos from './Contactenos';

class Principal extends React.Component {

    /*
    componentDidMount es una función de react que
    se llama antes de hacer el render y llama a cargar la
    organización en caso de que la url se haya llamado
    con un id distinto al de la organización en la que
    se encuentra actualmente
    */
    async componentDidMount(){
        document.title = "Principal";
        await this.props.cargarOrganizacion(this.props.idOrganizacion);
    }

    render(){
        return (
        <div className="container-fluid">
            <div className="row">
                <div className="col p-0">
                    <div className="row">
                        <div className="d-flex align-items-center justify-content-center h-100">
                            <img src={logoUcadied} className="mx-auto" alt="logo" />
                        </div>
                    </div>
                </div>
                <div className="col p-0">
                    <div className="container-fluid" style={{backgroundColor:"#194777", color:"#FFFFFF"}}>
                        <h2 className="text-center">¿Quiénes somos?</h2>
                        <div className="d-flex align-items-center">
                            <div className="container">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons</p>
                            </div>
                            
                        </div>
                    </div>
                    <div className="container-fluid" style={{backgroundColor:"#76B2CE", color:"#160C28"}}>
                        <h2 className="text-center">¿Qué hacer en Desamparados?</h2>
                        <div className="d-flex align-items-center">
                            <div className="container">
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons</p>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo cons</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Contactenos idOrganizacion={this.props.idOrganizacion} />
        </div>
       );
    }
}

export default Principal;