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
            <div className="mb-3">
                <div className="row">
                {this.props.telefonos.map((telefono, i) =>(
                    <div className="col" key={"tCont"-i}>
                        <div className="row" key={"tCont2"-i}>
                            <span className="col-3"  key={"t-"+telefono}>{telefono}</span>
                            <button className="btn btn-danger col-2" key={telefono} onClick={() => this.props.eliminarTelefono(telefono)}>X</button>
                        </div>
                    </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Telefonos;