import React from 'react';
import { Link } from 'react-router-dom'
import '../Estilos/Navegacion.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

import {usuarioContexto} from '../usuarioContexto';

class Navegacion extends React.Component {
    render(){
        return (
            <Navbar variant="green" bg="green" expand="lg">
                <Container fluid>
                    <usuarioContexto.Consumer >
                    {({usuario, cerrarSesionUsuario, organizacion})=>{
                        if(usuario.tipo === "Administrador"){
                        return (
                            <>
                            <Navbar.Brand as={Link} to="/unionCantonal" >Administrador</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to="/unionCantonal">Unión Cantonal</Nav.Link>
                                <Nav.Link as={Link} to="/asociaciones">Asociaciones</Nav.Link>
                                <Nav.Link as={Link} to="/usuarios">Usuarios</Nav.Link>
                                <Nav.Link as={Link} to="/administradores">Administradores</Nav.Link>

                            </Nav>
                            <Nav className="ms-auto">
                                <NavDropdown title="Configuración" align="end">
                                <NavDropdown.Item as={Link} to="/contrasenna" >Cambiar contraseña</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/iniciarSesion" onClick={cerrarSesionUsuario} >Cerrar Sesión</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            </Navbar.Collapse>
                            </>
                        );
                        } else if (usuario.tipo === "Usuario"){
                        return (
                            <>
                            <Navbar.Brand as={Link} to={"/principal/"+organizacion.id_organizacion}>UCADIED</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to={"/principal/"+organizacion.id}>Principal</Nav.Link>
                                <NavDropdown title="Presidencia">
                                <NavDropdown.Item as={Link} to={"/presidencia/juntaDirectiva/"+organizacion.id} >Junta Directiva</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to={"/presidencia/afiliados/"+organizacion.id} >Afiliados</NavDropdown.Item>
                                </NavDropdown>
                                <Nav.Link as={Link} to="/asociaciones">Asociaciones</Nav.Link>
                                <Nav.Link as={Link} to={"/proyectos/"+organizacion.id}>Proyectos</Nav.Link>
                                <Nav.Link as={Link} to={"/actividades/"+organizacion.id}>Actividades</Nav.Link>
                                <Nav.Link as={Link} to={"/inmuebles/"+organizacion.id}>Inmuebles</Nav.Link>
                                <Nav.Link as={Link} to={"/editarSitio/"+organizacion.id}>Editar Sitio</Nav.Link>

                            </Nav>
                            <Nav className="ms-auto">
                                <NavDropdown title="Configuración" align="end">
                                <NavDropdown.Item as={Link} to="/contrasenna" >Cambiar contraseña</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/iniciarSesion" onClick={cerrarSesionUsuario} >Cerrar Sesión</NavDropdown.Item>
                                </NavDropdown>
                            </Nav>
                            </Navbar.Collapse>
                            </>);
                        } else {
                        return(
                            <>
                            <Navbar.Brand as={Link} to={"/principal/"+organizacion.id_organizacion} >UCADIED</Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link as={Link} to={"/principal/"+organizacion.id}>Principal</Nav.Link>
                                <Nav.Link as={Link} to="/asociaciones">Asociaciones</Nav.Link>
                                <Nav.Link as={Link} to={"/calendarioActividades/"+organizacion.id}>Actividades</Nav.Link>
                            </Nav>
                            <Nav className="ms-auto">
                                <Nav.Link as={Link} to="/iniciarSesion" >Iniciar Sesión</Nav.Link>
                            </Nav>
                            </Navbar.Collapse>
                            </>);
                        }
                    }}
                    </ usuarioContexto.Consumer>
                </Container>
            </Navbar>
        );
    }
}

export default Navegacion;