import React from 'react';
import Validacion from './Validacion';
import Select from 'react-select';

class AgregaElemento extends React.Component {
    constructor(props){
        super(props);
        this.agregarElemento = this.props.agregarElemento;
        this.error = this.props.error;
        this.state = {
            elemento: "",
            error: ""
        };

        this.manejaCambio = this.manejaCambio.bind(this);
        this.agregaElemento = this.agregaElemento.bind(this);
    }

    manejaCambio(evento){
        const objetivo = evento.target;
        const valor = objetivo.value;
        this.setState({elemento:valor});
    }

    agregaElemento(){
        if(this.props.agregarElemento(this.state.elemento)){
            this.setState({elemento:""})
        }
        
    }

    getElemento(){
        return this.state.elemento;
    }

    render(){
        return (
            <div className="mb-3 position-relative">
                <label htmlFor="elemento" className="form-label">{this.props.titulo}</label>
                <div className="d-flex justify-content-between">
                    <div className="flex-grow-1 me-2">
                        {this.props.opciones ? 
                        <div className={this.props.error.length > 0 ? "p-0 form-control is-invalid":"p-0 form-control"}>
                        <Select 
                        isClearable
                        key="elemento" name="elemento" value={this.state.elemento} onChange={(opcion)=>this.manejaCambio({target:{name:"elemento",type:"select",value:opcion}})}
                        options={this.props.opciones}
                        />
                        </div>
                        :
                        <input type="text" className={this.props.error.length > 0 ? "form-control is-invalid":"form-control"} key="elemento" value={this.state.elemento} onChange={this.manejaCambio} name="elemento" />
                        }
                        <div className="invalid-tooltip">
                            {this.props.error}
                        </div>
                    </div>
                    <div className="">
                    <button type="button" className="btn btn-primary" onClick={this.agregaElemento}><i className="lni lni-plus"></i> Agregar</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default AgregaElemento;