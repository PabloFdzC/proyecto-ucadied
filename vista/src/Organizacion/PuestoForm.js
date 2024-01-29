import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

/*
Recibe los props:
idOrganizacion: número entero que indica la organización actual
soloCampos: booleano que indica si se debe solo usar la parte del formulario
    sin enviar la información directamente al server, sino que se envia a
    la función del prop agregaPuesto
agregaPuesto: función que envia la información del puesto para que lo use
    el componente padre
campos: Objeto con la forma de los campos (es opcional porque solo se ocupa
    si se va a usar el formulario para editar la organización)
avisaEnviado: Función que permite enviar la información del formulario
    al componente que sea el padre del componente actual (o sea este),
    se usa para actualizar la tabla con la información que se agrega
    cuando se envía el formulario
cerrarModal: Función para que se cierre el modal que contiene al formulario
    entonces solo si se pone en un modal es necesaria
*/
class PuestoForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.campos = props.campos ? props.campos : {};
        this.accion = Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar";
        this.titulo = this.accion+" Puesto";
        var campos = {
            id_organizacion:props.idOrganizacion,
            nombre: this.campos.nombre ? this.campos.nombre : "",
            edita_pagina: this.campos.edita_pagina ? this.campos.edita_pagina : false,
            edita_junta: this.campos.edita_junta ? this.campos.edita_junta : false,
            edita_proyecto: this.campos.edita_proyecto ? this.campos.edita_proyecto : false,
            edita_actividad: this.campos.edita_actividad ? this.campos.edita_actividad : false,
            edita_inmueble: this.campos.edita_inmueble ? this.campos.edita_inmueble : false,
        };
        this.state = {
            titulo: this.titulo,
            campos:campos,
            errores: {
                nombre: "",
                hayError: false,
            },
            enviado:false,
        };
        this.validacion = new Validacion({
            nombre: "requerido",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.enviarPuesto = this.enviarPuesto.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
        this.agregarPuesto = this.agregarPuesto.bind(this);
    }

    /*
    reiniciarCampos devuelve los campos del formulario
    a su valor inicial
     */
    reiniciarCampos(){
        this.setState({
            titulo: this.titulo,
            enviado:false,
            campos: Object.assign({},this.state.campos, {
                nombre: "",
                edita_pagina: false,
                edita_junta: false,
                edita_proyecto: false,
                edita_actividad: false,
                edita_inmueble:false,
            })
        });
    }

    /*
    Se llama a la función manejarCambio que actualiza el
    estado con los valores de campos en el formulario
    Parámetros:
    - evento: objeto del DOM o puede ser un objeto
        de la forma
        {
            target:{
                name:string con nombre que tiene el campo,
                type:string con el tipo de input que es,
                value:puede ser cualquiercosa con lo que
                    se deba llenar el input,
            }
        }
    */
    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    /*
    enviarPuesto se encarga de enviar la información del
    puesto al server ya sea para crear uno nuevo o para
    modificar uno
     */
    async enviarPuesto(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            let datos = this.state.campos;
            datos.id_organizacion = this.props.idOrganizacion;
            try{
                var resp;
                var titulo = "¡Creado con éxito!";
                if(this.accion === "Agregar"){
                    resp = await this.queriesGenerales.postear("/juntaDirectiva/crearPuesto", datos);
                } else {
                    resp = await this.queriesGenerales.postear("/juntaDirectiva/crearPuesto", datos);
                    titulo = "¡Modificado con éxito!";
                }
                this.setState({
                    enviado:true,
                    titulo: titulo,
                });
                this.props.avisaEnviado(resp.data);
            }catch(error){
                console.log(error);
            }
        }
    }

    /*
    agregarPuesto envia la información del puesto al componente
    padre
     */
    agregarPuesto(){
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            this.props.agregaPuesto(this.state.campos);
        }
    }

    render(){
        var campos = (<>
        <div className="mb-3 position-relative">
            <label htmlFor="nombre" className="form-label">Nombre</label>
            <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
            <div className="invalid-tooltip">
                {this.state.errores.nombre}
            </div>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id="edita_pagina" name="edita_pagina" checked={this.state.campos.edita_pagina} onChange={this.manejaCambio} />
            <label className="form-check-label" htmlFor="edita_pagina" >
                ¿Puede editar páginas?
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id="edita_junta" name="edita_junta" checked={this.state.campos.edita_junta} onChange={this.manejaCambio} />
            <label className="form-check-label" htmlFor="edita_junta" >
                ¿Puede editar Junta Directiva?
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id="edita_proyecto" name="edita_proyecto" checked={this.state.campos.edita_proyecto} onChange={this.manejaCambio} />
            <label className="form-check-label" htmlFor="edita_proyecto" >
                ¿Puede editar proyectos?
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id="edita_actividad" name="edita_actividad" checked={this.state.campos.edita_actividad} onChange={this.manejaCambio} />
            <label className="form-check-label" htmlFor="edita_actividad" >
                ¿Puede editar actividades?
            </label>
        </div>
        <div className="form-check">
            <input className="form-check-input" type="checkbox" id="edita_inmueble" name="edita_inmueble" checked={this.state.campos.edita_inmueble} onChange={this.manejaCambio} />
            <label className="form-check-label" htmlFor="edita_inmueble" >
                ¿Puede editar inmuebles?
            </label>
        </div>
        </>);
        return (<>
        {this.props.soloCampos ? 
            <>
                {campos}
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                        <button type="button" onClick={this.agregarPuesto} className="btn btn-primary">Agregar puesto</button>
                    </div>
                </div>
            </> : 
            <>
                <h2 className="modal-title text-center">{this.state.titulo}</h2>
                {!this.state.enviado ? 
                <form onSubmit={this.enviarPuesto} className="needs-validation" noValidate>
                    {campos}
                    <div className="d-flex justify-content-end">
                        {this.props.cerrarModal ?
                        <div className="m-1">
                            <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.props.cerrarModal();this.reiniciarCampos()}}>Volver</button>
                        </div>:
                        <></>
                        }
                        <div className="m-1">
                            <button type="submit" className="btn btn-primary">{this.accion}</button>
                        </div>
                    </div>
                </form>
                :
                <div className="d-flex justify-content-end">
                    {this.accion === "Agregar" ?
                    <div className="m-1">
                        <button type="button" className="btn btn-primary" aria-label="Agregar Otro" onClick={this.reiniciarCampos}>Agregar otro</button>
                    </div>:
                    <></>}
                    {this.props.cerrarModal ?
                    <div className="m-1">
                        <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={()=>{this.props.cerrarModal();this.reiniciarCampos()}}>Volver</button>
                    </div>:
                    <></>
                    }
                </div>
                }
            </> 
        }   
        </>
        );
    }
}

export default PuestoForm;