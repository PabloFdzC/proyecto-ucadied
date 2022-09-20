import React from 'react';
import manejarCambio from '../Utilidades/manejarCambio';

class Telefonos extends React.Component {
    constructor(props){
        super(props);
        this.eliminarTelefono = this.props.eliminarTelefono;
        this.telefonos = this.props.telefonos;
    }



    render(){
        return (
            <div className="m-3 pl-4 pr-4">    
                {this.props.telefonos.map((telefono, i) =>(
                    <div className="container m-2  p-2" key={"tCont"+i} style={{backgroundColor:"#160C28",borderRadius:"0.2em"}}>
                        <div className="d-flex justify-content-between" key={"tContR"+i} style={{maxWidth:"100%"}}>
                            <span className="align-middle"  key={"t"+i}>{telefono}</span>
                            <button type="button" className="btn btn-danger" key={"tb"+i} onClick={() => this.props.eliminarTelefono(telefono)}><i className="lni lni-trash-can"></i></button>
                        </div>
                    </div>
                    ))}
            </div>
        );
    }
}

export default Telefonos;