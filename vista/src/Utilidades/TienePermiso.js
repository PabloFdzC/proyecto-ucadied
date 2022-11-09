import React from 'react';
import { Navigate, Link } from 'react-router-dom';
import { usuarioContexto } from '../usuarioContexto';



class TienePermiso extends React.Component {

    continuar(){
      const props = {
        ...this.props
      }
      delete props.componente;
      const componente = this.props.componente;
      return <>{React.cloneElement(componente,
        props)}</>;
    }
    
    async componentDidMount(){
      await this.props.cargarOrganizacion(this.props.idOrganizacion);
    }

    async cambiarOrganizacion(id){
      await this.props.cargarOrganizacion(id);
      window.location = this.props.ruta+id;
    }

    render(){
        return (
          <usuarioContexto.Consumer >
            {({usuario, organizacion})=>{
              if(usuario.tipo === "Administrador"){
                return this.continuar();
              }
              if(usuario.tipo === "Usuario"){
                for(let puesto of usuario.puestos){
                  if(puesto.id_organizacion === organizacion.id && puesto[this.props.permiso]){
                    return this.continuar();
                  }
                }
                return (
                  <div className="d-flex flex-column center-text justify-content-center align-items-center" style={{height:"inherit"}}>
                    <h1>No cuenta con los permisos necesarios.</h1>
                    <h3>Volver a:</h3>
                    {usuario.puestos.length > 0 ?
                        usuario.puestos[0][this.props.permiso] ?
                          <a className="btn btn-primary" onClick={()=>this.cambiarOrganizacion(usuario.puestos[0].id_organizacion)}>Mi asociación</a>
                        :
                          <Link className="btn btn-primary" to={"/principal/"+organizacion.id}>Página principal de la {organizacion.id === organizacion.id_organizacion ? "unión": "asociación"}</Link>
                    :
                    <Link className="btn btn-primary" to={"/principal/"+organizacion.id}>Página principal de la {organizacion.id === organizacion.id_organizacion ? "unión": "asociación"}</Link>}
                  </div>
                );
              }
              return <Navigate to='/iniciarSesion' replace={true}/>;
            }}
          </usuarioContexto.Consumer>);
    }
}

export default TienePermiso;