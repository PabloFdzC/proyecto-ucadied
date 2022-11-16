import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

import Reaptcha from 'reaptcha';

class ContactoForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.organizacionPedida = false;
        var campos = {
            captcha:"",
            nombre: "",
            email: "",
            telefono: "",
            mensaje: ""
        };
        if(props.campos){
            campos = {
                nombre: props.campos.nombre ? props.campos.nombre : "",
                email: props.campos.email ? props.campos.email : "",
                telefono: props.campos.telefono ? props.campos.telefono : "",
                mensaje: props.campos.mensaje ? props.campos.mensaje : "",
            };
        }
        this.state = {
            campos:campos,
            errores: {
                captcha:"",
                nombre: "",
                email: "",
                telefono: "",
                mensaje: ""
            },
            territorio: "",
            email: "",
            telefonos:[],
            titulo: this.props.titulo,
            enviado:false,
        };
        this.validacion = new Validacion({
            captcha:"captcha",
            nombre: "requerido",
            email: "requerido|email",
            telefono: "requerido|numeros",
            mensaje: "requerido"
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.enviarMensaje = this.enviarMensaje.bind(this);
        this.captchaVerificado = this.captchaVerificado.bind(this);
    }

    reiniciarCampos(){
        this.setState({
            titulo: this.props.titulo,
            enviado:false,
            campos: Object.assign({},this.state.campos, {
                nombre: "",
                email: "",
                telefono: "",
                mensaje: ""
            })
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async enviarMensaje(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                const campos = {
                    captcha:this.state.campos.captcha,
                    nombre:this.state.campos.nombre,
                    email:this.state.campos.email,
                    telefono:this.state.campos.telefono,
                    mensaje:this.state.campos.mensaje,
                    email_organizacion: this.props.emailOrganizacion,
                }
                const resp = await this.queriesGenerales.postear("/enviarMensaje", campos);
                this.setState({
                    creado:true,
                    titulo:"¡Enviado con Éxito!",
                });
                this.avisaCreado(resp.data);
            }catch(error){
                console.log(error);
            }
        }
    }

    captchaVerificado(captcha){
        this.setState({
            campos: Object.assign({}, this.state.campos, {
                captcha,
            }),
        });
    }


    render(){
        const captcha =
        <div className="mb-3 position-relative">
            <Reaptcha
                onVerify={this.captchaVerificado}
                onExpired={()=>this.captchaVerificado("")}
                onError={()=>this.captchaVerificado("")}
                sitekey="6Leu-2kiAAAAAMHi78aFYa-E444kM55j7bRqQyMa" />
            <input className={this.state.errores.captcha.length > 0 ? "form-control is-invalid":"form-control"} style={{display:"none"}} />
            <div className="invalid-tooltip">
                {this.state.errores.captcha}
            </div>
        </div>;

        return (   
        <>
            <h3>Envíar mensaje</h3>
            <form  onSubmit={this.enviarMensaje} noValidate>
                <div className="mb-3 position-relative">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.nombre}
                    </div>
                </div>

                <div className="mb-3 position-relative">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="text" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" required value={this.state.campos.email} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.email}
                    </div>
                </div>

                <div className="mb-3 position-relative">
                    <label htmlFor="telefono" className="form-label">Telefono</label>
                    <input type="text" className={this.state.errores.telefono.length > 0 ? "form-control is-invalid":"form-control"} key="telefono" name="telefono" required value={this.state.campos.telefono} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.telefono}
                    </div>
                </div>      

                <div className="mb-3 position-relative">
                    <label htmlFor="mensaje" className="form-label">Mensaje</label>
                    <textarea type="text" cols="30" rows="6" className={this.state.errores.mensaje.length > 0 ? "form-control is-invalid":"form-control"} key="mensaje" name="mensaje" required value={this.state.campos.mensaje} onChange={this.manejaCambio}></textarea>
                    <div className="invalid-tooltip">
                        {this.state.errores.mensaje}
                    </div>
                </div>
                {captcha}
                <div className="d-flex justify-content-end">
                    <div className="m-1">
                        <button type="submit" className="btn btn-primary">Enviar</button>
                    </div> 
                </div> 
            </form>
        </>
        );
    }
}

export default ContactoForm;