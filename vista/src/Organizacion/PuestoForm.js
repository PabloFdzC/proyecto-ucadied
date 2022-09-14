import React from 'react';
import { postear } from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

class PuestoForm extends React.Component {
    constructor(props){
        super(props);
        this.url = props.url;
        this.agregarPuesto = props.agregarPuesto;
        // Este de campos es importante para cuando vamos a editar
        // la información de algún usuario se autocompleten los campos
        this.campos = props.campos;
        // A cada campo le ponemos el valor que tenga el prop y si
        // el prop no tiene el campo entonces se pone en su forma
        // vacía
        this.state = {
            nombre: "",
            funcion: ""
        };
        var campos = {
            nombre: "",
            funcion: "",
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                funcion: props.campos.funcion ? props.campos.funcion : "",
            };
        }
        // Aquí es poner los campos del formulario dentro de 
        // un objeto que se llame campos y poner otro objeto para
        // los errores (este ocupa el atributo hayError para usarlo
        // cuando no queremos que se mande el formulario, los demás
        // campos son los que tenga que validar en el formulario)
        this.state = {
            campos:campos,
            errores: {
                nombre: "",
                funcion:""
            }
        };
        // Se tiene que inicializar la clase de validación
        // diciendole qué tiene que revisar. Si ocupa hacer
        // validaciones para un mismo campo los separa con |
        // eso sí pongalos pegados como sale en this.validacionTelefono
        this.validacion = new Validacion({
            nombre: "requerido",
            funcion: "requerido"
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearPuesto = this.crearPuesto.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearPuesto(evento){
        evento.preventDefault();
        const datos = this.state;
        console.log(datos)
        // De la validación solo importa esta línea que sigue y a
        // la hora de postear lo demás lo pone igual a como lo tiene
        this.validacion.validarCampos(this.state.campos);
        let url = "/puestoForm";
        try{
            // Esta que en lugar de pasar datos pasa this.state.campos
            await postear(url+"/crear", this.state.campos);
        }catch(error){
            console.log(error);
        }
    }

    render(){
        return (
            <form onSubmit={this.crearPuesto} className="needs-validation" noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nombre}
                    </div>
                </div>
                
                <div className="mb-3 position-relative">
                    <label htmlFor="funcion" className="form-label">Funcion</label>
                    <input type="text" className={this.state.errores.funcion.length > 0 ? "form-control is-invalid":"form-control"} key="funcion" name="funcion" required value={this.state.campos.funcion} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.funcion}
                    </div>
                </div>
                <button type="button" className="btn btn-secondary">Volver</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        );
    }
}

export default PuestoForm;