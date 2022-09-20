import React from 'react';
import { Link } from 'react-router-dom'
import '../Estilos/Navegacion.css';

import {usuarioContexto} from '../usuarioContexto';

class Navegacion extends React.Component {
    render(){
        return (
            <usuarioContexto.Consumer >
                {({usuario, cerrarSesionUsuario})=>{
                    if(usuario.tipo === "Administrador"){
                        return (<nav className="navbar navbar-expand-lg navbar-green bg-green">
                            <div className="container-fluid">
                                <Link className="navbar-brand" to="/unionCantonal">Administrador</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to="/unionCantonal">Unión Cantonal</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to="/asociaciones">Asociaciones</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to="/usuarios">Usuarios</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to="/administradores">Administradores</Link>
                                    </li>
                                </ul>
                                <ul className="navbar-nav navbar-right">
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="configuracion" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Configuración
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="configuracion">
                                            <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                                            <li><Link className="dropdown-item" to="/iniciarSesion" onClick={cerrarSesionUsuario}>Cerrar Sesion</Link></li>
                                        </ul>
                                    </li>
                                    
                                </ul>
                                </div>
                            </div>
                        </nav>);
                    } else if (usuario.tipo === "Usuario"){
                        return (<nav className="navbar navbar-expand-lg navbar-green bg-green">
                            <div className="container-fluid">
                                <Link className="navbar-brand" to="/">UCADIED</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                    <li className="nav-item">
                                        <Link className="nav-link" aria-current="page" to={"/principal/"+this.props.organizacionActual}>Principal</Link>
                                    </li>
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="presidencia" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Presidencia
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="presidencia">
                                            <li><Link className="dropdown-item" to={"/presidencia/juntaDirectiva/"+this.props.organizacionActual}>Junta Directiva</Link></li>
                                            <li><Link className="dropdown-item" to={"/presidencia/afiliados/"+this.props.organizacionActual}>Afiliados</Link></li>
                                            <li><hr className="dropdown-divider" /></li>
                                            <li><Link className="dropdown-item" to="/presidencia/asociaciones">Asociaciones</Link></li>
                                        </ul>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/presidencia/asociaciones">Asociaciones</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={"/proyectos/"+this.props.organizacionActual}>Proyectos</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={"/actividades/"+this.props.organizacionActual}>Actividades</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={"/mapaDeSitio/"+this.props.organizacionActual}>Mapa de sitio</Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link className="nav-link" to={"/editarSitio/"+this.props.organizacionActual}>Editar sitio</Link>
                                    </li>
                                </ul>
                                <ul className="navbar-nav navbar-right">
                                    <li className="nav-item dropdown">
                                        <Link className="nav-link dropdown-toggle" to="#" id="configuracion" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            Configuración
                                        </Link>
                                        <ul className="dropdown-menu" aria-labelledby="configuracion">
                                            <li><Link className="dropdown-item" to="/perfil">Perfil</Link></li>
                                            <li><Link className="dropdown-item" to="/iniciarSesion" onClick={cerrarSesionUsuario}>Cerrar Sesion</Link></li>
                                        </ul>
                                    </li>
                                    
                                </ul>
                                </div>
                            </div>
                        </nav>);
                    } else {
                        return (<nav className="navbar navbar-expand-lg navbar-green bg-green">
                            <div className="container-fluid">
                                <Link className="navbar-brand" to="/">UCADIED</Link>
                                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                    <span className="navbar-toggler-icon"></span>
                                </button>
                                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                                        <li className="nav-item">
                                            <Link className="nav-link" aria-current="page" to={"/principal/"+this.props.organizacionActual}>Principal</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" aria-current="page" to="/asociaciones">Asociaciones</Link>
                                        </li>
                                        <li className="nav-item">
                                            <Link className="nav-link" to={"/mapaDeSitio/"+this.props.organizacionActual}>Mapa de sitio</Link>
                                        </li>
                                    </ul>
                                    <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
                                        <li className="nav-item">
                                        <Link className="nav-link" to="/iniciarSesion">Iniciar sesión</Link>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </nav>);
                    }
                }}
                
            </usuarioContexto.Consumer>
        );
    }
}

export default Navegacion;