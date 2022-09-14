import React from 'react';
import { postear } from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaTelefono from '../Usuario/AgregaTelefono';
import Telefonos from '../Usuario/Telefonos';
import Validacion from '../Utilidades/Validacion';

class AsociacionForm extends React.Component {
    constructor(props){
        super(props);
        this.url = props.url;
        this.agregarAsociacion = props.agregarAsociacion;
        // Este de campos es importante para cuando vamos a editar
        // la información de algún usuario se autocompleten los campos
        this.campos = props.campos;
        // A cada campo le ponemos el valor que tenga el prop y si
        // el prop no tiene el campo entonces se pone en su forma
        // vacía
        var campos = {
            nombre: "",
            territorio: "",
            domicilio: "",
            cedula: "",
            telefonos:[]
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                territorio: props.campos.territorio ? props.campos.territorio : "",
                domicilio: props.campos.domicilio ? props.campos.domicilio : "",
                cedula: props.campos.cedula ? props.campos.cedula : "",
                telefonos:props.campos.telefonos ? props.campos.telefonos : [],
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
                territorio: "",
                domicilio: "",
                cedula: "",
                telefonos:""
            }
        };
        // Se tiene que inicializar la clase de validación
        // diciendole qué tiene que revisar. Si ocupa hacer
        // validaciones para un mismo campo los separa con |
        // eso sí pongalos pegados como sale en this.validacionTelefono
        this.validacion = new Validacion({
            nombre: "requerido",
            territorio: "requerido",
            domicilio: "requerido",
            cedula: "requerido",
            telefonos: "tiene-valores"
        }, this);
        // Este se ocupa solo para cuando se usa el componente de telefonos
        // para validar cada vez que meta un nuevo telefono
        this.validacionTelefono = new Validacion({
            telefonos: "requerido|numeros"
        }, this);

        this.agregarTelefono = this.agregarTelefono.bind(this);
        this.eliminarTelefono = this.eliminarTelefono.bind(this);
        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearAsociacion = this.crearAsociacion.bind(this);
    }

    // Esta función puede ponerla igual a como está aquí para
    // cuando usa el componente de telefonos
    agregarTelefono(telefono){
        this.validacionTelefono.validarCampos({telefonos:telefono});
        if(!this.state.errores.hayError){
            let telefonos = this.state.campos.telefonos.concat(telefono);
            this.setState({
                campos: Object.assign({},this.state.campos, {
                    telefonos:telefonos
                }),
                errores: Object.assign({}, this.state.errores, {
                    telefonos: "",
                })
            });
        }
    }

    // Esta función puede ponerla igual a como está aquí para
    // cuando usa el componente de telefonos
    eliminarTelefono(telefono){
        let i = this.state.campos.telefonos.indexOf(telefono);
        if (i > -1){
            this.state.campos.telefonos.splice(i, 1);
            this.setState({});
            
        }
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearAsociacion(evento){
        evento.preventDefault();
        const datos = this.state;
        console.log(datos)
        // De la validación solo importa esta línea que sigue y a
        // la hora de postear lo demás lo pone igual a como lo tiene
        this.validacion.validarCampos(this.state.campos);
        let url = "/asociacionForm";
        try{
            // Esta que en lugar de pasar datos pasa this.state.campos
            await postear(url+"/crear", this.state.campos);
        }catch(error){
            console.log(error);
        }
    }

    render(){
        return (
            <form onSubmit={this.crearAsociacion} noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nombre}
                    </div>
                </div>
                
                <div className="mb-3 position-relative">
                    <label htmlFor="territorio" className="form-label">Territorio</label>
                    <input type="text" className={this.state.errores.territorio.length > 0 ? "form-control is-invalid":"form-control"} key="territorio" name="territorio" value={this.state.campos.territorio} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.territorio}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="domicilio" className="form-label">Domicilio</label>
                    <input type="text" className={this.state.errores.domicilio.length > 0 ? "form-control is-invalid":"form-control"} key="domicilio" name="domicilio" value={this.state.campos.domicilio} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.domicilio}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="cedula" className="form-label">Cedula</label>
                    <input type="text" className={this.state.errores.cedula.length > 0 ? "form-control is-invalid":"form-control"} key="cedula" name="cedula" value={this.state.campos.cedula} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.cedula}
                    </div>
                </div>
                <AgregaTelefono agregarTelefono={this.agregarTelefono} error={this.state.errores.telefonos} />
                <Telefonos telefonos={this.state.campos.telefonos} eliminarTelefono={this.eliminarTelefono} />
                <button type="button" className="btn btn-secondary">Volver</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        );
    }
}

export default AsociacionForm;