import React from 'react';
import manejarCambio from '../Utilidades/manejarCambio';

class AgregaTelefono extends React.Component {
    constructor(props){
        super(props);
        this.agregarTelefono = this.props.agregarTelefono;
        this.state = {
            telefono: ""
        };
        this.manejaCambio = this.manejaCambio.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    render(){
        return (
            <div className="mb-3">
                <label htmlFor="telefono" className="form-label">Teléfonos</label>
                <div className="row">
                    <input type="text" className="form-control col" key="telefono" value={this.state.telefono} onChange={this.manejaCambio} name="telefono" />
                    <button type="button" className="btn btn-primary col-1" onClick={() => this.props.agregarTelefono(this.state.telefono)}>+</button>
                </div>
                <div className="invalid-tooltip">
                    Se ocupa al menos un teléfono.
                </div>
            </div>
        );
    }
}

export default AgregaTelefono;