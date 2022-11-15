import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import Validacion from '../Utilidades/Validacion';
import Reaptcha from 'reaptcha';
import manejarCambio from '../Utilidades/manejarCambio';
import Spinner from 'react-bootstrap/Spinner';


/*
Recibe los props:
cargarOrganizacion: Función de App.js para cargar la organización
    en la que se encuentra actualmente el usuario,
idOrganizacion: Número entero que es el id de la organización en la que se
    encuentra actualmente (es el mismo que está en la url),
 */
class OlvidaContrasenna extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            campos:{
                email: "",
                captcha:"",
            },
            errores:{
                hayError:false,
                email: "",
                captcha:"",
            },
            enviado:false,
            procesando:false,
            muestraMensajeError:false,
            mensajeError:"",
        };

        this.validacion = new Validacion({
            email: "requerido|email",
            captcha:"captcha",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.captchaVerificado = this.captchaVerificado.bind(this);
        this.restablecerContrasenna = this.restablecerContrasenna.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async restablecerContrasenna(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                this.setState({
                    procesando:true,
                });
                const resp = await this.queriesGenerales.modificar("/usuario/restablecerContrasenna", this.state.campos);
                this.setState({
                    enviado:true,
                });
            }catch(error){
                console.log(error);
                this.setState({
                    mensajeError:error.response.data.error,
                    muestraMensajeError:true,
                });
            }
        }
    }

    captchaVerificado(captcha){
        this.setState({
            campos: Object.assign({}, this.state.campos, {
                captcha,
            }),
            errores: Object.assign({}, this.state.errores, {
                captcha:"",
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
                <div className="d-flex align-items-center justify-content-between m-3">
                    <div>
                        <h1>Restablecer contraseña</h1>
                    </div>
                </div>
                <div className="d-flex" style={{height:"inherit"}}>
                    <div className="row w-100 m-0 justify-content-center align-items-center" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
                        <div className="col-2 p-3" style={{width:"400px"}}>
                            {this.state.enviado ? 
                                <>
                                    <h2 className="text-center">¡Enviado con éxito!</h2>
                                    <p className="text-center">Revise su correo electrónico.</p>
                                </>
                            :
                                this.state.procesando ?
                                <Spinner animation="border" role="generando nueva contraseña" variant="light" />
                                :
                                <>
                                    <p className="text-center">Ingrese su correo electrónico para enviar una contraseña con la que pueda ingresar al sistema.</p>
                                    <form onSubmit={this.restablecerContrasenna} className="needs-validation" noValidate>
                                        <div className="mb-3 position-relative">
                                            <label htmlFor="email" className="form-label">Email</label>
                                            <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} required onChange={this.manejaCambio} />
                                            <div className="invalid-tooltip">
                                                {this.state.errores.email}
                                            </div>
                                        </div>
                                        {captcha}
                                        
                                        <div className="d-flex justify-content-end mt-1">
                                            <button type="submit" className="btn btn-primary">Enviar email</button>
                                        </div>
                                    </form>
                                </>
                            }
                        </div>
                        
                    </div>
                </div>
            </>
        );
    }
}

export default OlvidaContrasenna;