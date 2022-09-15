import React from 'react';
import MiembroJuntaDirectivaForm from './MiembroJuntaDirectivaForm.js';
import JuntaDirectivaForm from './JuntaDirectivaForm.js';
import Tabla from '../Utilidades/Tabla.js'

class JuntaDirectiva extends React.Component {
    constructor(props){
        super(props);
        this.juntaDirectivaId = props.juntaDirectivaId;
    }



    render(){
        var juntaDatos;
        if(!isNaN(this.props.juntaDirectivaId)){
            juntaDatos = (
                <div className="container-fluid">
                    <div className="row">
                        <h1>Junta Directiva</h1>
                    </div>
                    <div className="row">
                        <JuntaDirectivaForm />
                    </div>
                </div>);
        } else {
            juntaDatos = (
                <div className="container-fluid">
                    <div className="row align-items-center justify-content-between m-3">
                        <div className="col-8">
                            <h1>Miembros de Junta Directiva</h1>
                        </div>
                        <div className="col-4">
                            <div className="row">
                                <div className="col">
                                    <button className="btn btn-dark"><i className="lni lni-plus"></i>  Agregar puesto</button>
                                </div>
                                <div className="col">
                                    <button className="btn btn-primary"><i className="lni lni-plus"></i>  Agregar miembro</button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <Tabla titulos={["1", "2"]} datos={[["a", "b"],["a", "b"],["a", "b"]]} />
                    </div>
                </div>
            );
        }
        return (
            <div className="container-fluid mx-auto">
                {juntaDatos}
                <div className="modal" tabIndex="-1">
                    <div className="modal-dialog">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Agregar miembro de Junta Directiva</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <MiembroJuntaDirectivaForm />
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-primary">Save changes</button>
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default JuntaDirectiva;