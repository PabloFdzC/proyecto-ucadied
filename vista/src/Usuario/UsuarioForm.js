import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import AgregaTelefono from './AgregaTelefono';
import Telefonos from './Telefonos';
import Validacion from '../Utilidades/Validacion';

class UsuarioForm extends React.Component {
    constructor(props){
        super(props);
        this.url = props.url;
        this.administrador = props.administrador;

        this.queriesGenerales = new QueriesGenerales();
        // Este de campos es importante para cuando vamos a editar
        // la información de algún usuario se autocompleten los campos
        this.campos = props.campos;
        // A cada campo le ponemos el valor que tenga el prop y si
        // el prop no tiene el campo entonces se pone en su forma
        // vacía
        var campos = {
            nombre: "",
            necesitaCuenta: this.administrador,
            nacimiento: "",
            nacionalidad: "",
            profesion: "",
            email: "",
            telefonos:[],
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                necesitaCuenta: this.administrador || props.campos.email,
                nacimiento: props.campos.nacimiento ? props.campos.nacimiento : "",
                nacionalidad: props.campos.nacionalidad ? props.campos.nacionalidad : "",
                profesion: props.campos.profesion ? props.campos.profesion : "",
                email: props.campos.email ? props.campos.email : "",
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
                hayError:false,
                nombre: "",
                nacimiento: "",
                nacionalidad: "",
                profesion: "",
                email: "",
                telefonos:""
            }
        };
        // Se tiene que inicializar la clase de validación
        // diciendole qué tiene que revisar. Si ocupa hacer
        // validaciones para un mismo campo los separa con |
        // eso sí pongalos pegados como sale en this.validacionTelefono
        this.validacion = new Validacion({
            nombre: "requerido",
            nacimiento: "requerido",
            nacionalidad: "seleccionado",
            profesion: "requerido",
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
        this.crearUsuario = this.crearUsuario.bind(this);
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

    async crearUsuario(evento){
        evento.preventDefault();
        if (this.state.campos.necesitaCuenta){
            this.validacion.agregarRegla("email", "requerido|email");
        } else {
            this.validacion.eliminarRegla("email");
        }
        // De la validación solo importa esta línea que sigue y a
        // la hora de postear lo demás lo pone igual a como lo tiene
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            let url = "usuario";
            if(this.administrador){
                url = "administrador"
            }
            try{
                // Esta que en lugar de pasar datos pasa this.state.campos
                const res = await this.queriesGenerales.postear(url+"/crear", this.state.campos);
                console.log(res);
            }catch(error){
                console.log(error);
            }
        }
    }

    render(){
        // De aquí fíjese que para el div que contiene a cada campo le añadí
        // en className position-relative esto es para que aparezcan los
        // mensajes de error.

        // En los inputs y select le pone en el className:
        // {this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"}
        // para que cambie el estilo cuando se valida. Al value hay que ponerlo bien,
        // como al state para los campos los tenemos dentro de un objeto de campos
        // ya no sería this.state.nombre sino this.state.campos.nombre

        // Para que se muestre el error debajo del campo tiene que poner
        //<div className="invalid-tooltip">
        //  {this.state.errores.nombre}
        //</div>

        let necesitaCuentaChck;
        if(!this.props.administrador){
            necesitaCuentaChck = (
            <div className="form-check">
                <input className="form-check-input" type="checkbox" id="necesitaCuenta" checked={this.state.campos.necesitaCuenta} onChange={this.manejaCambio} />
                <label className="form-check-label" htmlFor="necesitaCuenta" >
                    ¿Necesita cuenta?
                </label>
            </div>);
        }
        return (
            <form onSubmit={this.crearUsuario}  noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nombre}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="nacimiento" className="form-label">Fecha de nacimiento</label>
                    <input type="date" className={this.state.errores.nacimiento.length > 0 ? "form-control is-invalid":"form-control"} key="nacimiento" name="nacimiento" required value={this.state.campos.nacimiento} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nacimiento}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="nacionalidad" className="form-label">Nacionalidad</label>
                    <select className={this.state.errores.nacionalidad.length > 0 ? "form-select is-invalid":"form-select"} aria-label="nacionalidad" key="nacionalidad" name="nacionalidad" value={this.state.campos.nacionalidad} onChange={this.manejaCambio} >
                        <option defaultValue>Nacionalidad</option>
                        <option value="1">One</option>
                        <option value="2">Two</option>
                        <option value="3">Three</option>
                    </select>
                    <div className="invalid-tooltip">
                        {this.state.errores.nacionalidad}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="profesion" className="form-label">Profesión</label>
                    <input type="text" className={this.state.errores.profesion.length > 0 ? "form-control is-invalid":"form-control"} key="profesion" name="profesion" value={this.state.campos.profesion} onChange={this.manejaCambio} required />
                    <div className="invalid-tooltip">
                        {this.state.errores.profesion}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.email}
                    </div>
                </div>
                {necesitaCuentaChck}
                <AgregaTelefono agregarTelefono={this.agregarTelefono} error={this.state.errores.telefonos} />
                <Telefonos telefonos={this.state.campos.telefonos} eliminarTelefono={this.eliminarTelefono} />
                <button type="button" className="btn btn-secondary">Volver</button>
                <button type="submit" className="btn btn-primary">Enviar</button>
            </form>
        );
    }
}

export default UsuarioForm;