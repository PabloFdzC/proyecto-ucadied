import React from 'react';
import Validacion from '../Utilidades/Validacion';

class AgregaTelefono extends React.Component {
    constructor(props){
        super(props);
        this.agregarTelefono = this.props.agregarTelefono;
        this.error = this.props.error;
        this.state = {
            telefono: "",
            error: ""
        };

        this.manejaCambio = this.manejaCambio.bind(this);
    }

    manejaCambio(evento){
        const objetivo = evento.target;
        const valor = objetivo.value;
        this.setState({telefono:valor});
    }

    render(){
        return (
            <div className="mb-3 position-relative">
                <label htmlFor="telefono" className="form-label">Teléfonos </label>
                <div className="row justify-content-between" style={{maxWidth:"100%"}}>
                    <div className="col-11">
                        <input type="text" className={this.props.error.length > 0 ? "form-control is-invalid":"form-control"} key="telefono" value={this.state.telefono} onChange={this.manejaCambio} name="telefono" />
                        <div className="invalid-tooltip">
                            {this.props.error}
                        </div>
                    </div>
                    <div className="col-1">
                    <button type="button" className="btn btn-primary" onClick={() => this.props.agregarTelefono(this.state.telefono)}><i className="lni lni-plus"></i></button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AgregaTelefono;