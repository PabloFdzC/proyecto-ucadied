import React from 'react';
import { Link } from 'react-router-dom';

class CajasOrganizaciones extends React.Component{
  
  render(){
    if(this.props.organizaciones.length > 0){
      return this.props.organizaciones.map((a, i) =>
      <div className="col-sm-12 col-md-4 d-flex flex-column" key={"aCol"+i} style={i%2===0 ? {backgroundColor:"#137E31",color:"#FFFFFF"} : {backgroundColor:"#76B2CE",color:"#160C28"}}>
              <div className="row">
                  <div className="col">
                      <div className="container p-3" key={"aCont"+i}>
                          <h3 key={"t"+i}>{a.nombre}</h3>
                          <p key={"c"+i}>Cédula jurídica: {a.cedula}</p>
                          <p key={"d"+i}>Domicilio: {a.domicilio}</p>
                          <p key={"te"+i}>Territorio: {a.territorio}</p>
                          <p key={"tels"+i}>Telefonos:</p>
                          {a.telefonos.map((t, j) => 
                              <div className="m-2 p-2" key={"encC"+i+"-"+j} style={{backgroundColor:"#160C28",borderRadius:"0.2em",color:"#fff"}}>
                                  <p key={"tels"+i+"-"+j}>{t}</p>
                              </div>
                          )}
                      
                      </div>
                  </div>
                  <div className="col d-flex flex-column p-3">
                  {this.props.soloVer ?
                          <Link key={"v"+i} className="btn btn-primary" to={"/principal/"+a.id}>Visitar</Link> :
                          <>
                              <Link key={"v"+i} className="btn btn-primary m-1" to={"/principal/"+a.id}><i className="lni lni-website"></i> Visitar</Link>
                              <button key={"m"+i} className="btn btn-dark m-1" onClick={()=>this.props.modificar(a,i)}><i className="lni lni-pencil-alt"></i>  Modificar</button>
                              <Link key={"jd"+i} className="btn btn-secondary m-1" to={"/presidencia/juntaDirectiva/"+a.id}><i className="lni lni-users"></i> Junta Directiva</Link>
                              <button key={"e"+i} className="btn btn-danger m-1" onClick={()=>this.props.eliminar(a.id)}><i className="lni lni-trash-can"></i> Eliminar</button>
                          </>
                      }
                  </div>
              </div>
          </div>);
    } 
    return <></>;
    
  }
}

export default CajasOrganizaciones;