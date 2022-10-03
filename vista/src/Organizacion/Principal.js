import React from 'react';
import logoUcadied from '../Imagenes/logo-UCADIED.png';
import { useParams } from "react-router-dom";
import Contactenos from './Contactenos';

function ConParams(props) {
    const { id } = useParams();
    localStorage.setItem("organizacionActual", id);
    return <>{React.cloneElement(props.componente,
      {id:id})}</>;
  }

class Principal extends React.Component {
    constructor(props){
        super(props);
        this.soloVer = props.soloVer;
        this.id = props.id; // id de url
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
            </div> <ConParams app={this} componente={<Contactenos />} />
        </div>
       );
    }
}

export default Principal;