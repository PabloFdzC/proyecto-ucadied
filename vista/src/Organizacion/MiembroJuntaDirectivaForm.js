import React from 'react';
import { postear } from "../QueriesGenerales";

class MiembroJuntaDirectivaForm extends React.Component {
    constructor(props){
        super(props);
        this.agregarMiembro = this.agregarMiembro.bind(this);
    }

    async agregarMiembro(evento){
        evento.preventDefault();
        const datos = new FormData(evento.target);
        try{
            await postear("/juntaDirectiva/agregarMiembro", datos);
        }catch(error){
            //console.log(error);
        }
    }

    render(){
        return (
            <form onSubmit={this.agregarMiembro} className="needs-validation" noValidate>
                <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" key="nombre" name="nombre" required />
                    <div className="invalid-tooltip">
                        Se ocupa un nombre.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="puesto" className="form-label">puesto</label>
                    <select className="form-select" aria-label="puesto" key="puesto" name="puesto">
                        <option defaultValue>Puestos</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="invalid-tooltip">
                        Se ocupa un puesto.
                    </div>
                </div>
                <button type="button" className="btn btn-primary">Agregar puesto</button>
                <button type="submit" className="btn btn-primary">Agregar miembro</button>
            </form>
        );
    }
}

export default MiembroJuntaDirectivaForm;