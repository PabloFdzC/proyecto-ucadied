import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';
import Toast from 'react-bootstrap/Toast';

class ContrasennaForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.state = {
            campos:{
                email:"",
                contrasenna:"",
                ccontrasenna:"",
            },
            errores:{
                hayError:false,
                email:"",
                contrasenna:"",
                ccontrasenna:"",
            },
            muestraMensajeError:false,
            mensajeError:"",
        }

        this.validacion = new Validacion({
            email: "requerido|email",
            contrasenna: "requerido",
            ccontrasenna: "requerido",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.modificarContrasenna = this.modificarContrasenna.bind(this);
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async modificarContrasenna(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(this.state.errores.contrasenna === "" && this.state.campos.contrasenna !== this.state.campos.ccontrasenna){
            this.setState({
                errores: Object.assign({},this.state.errores, {
                    hayError:true,
                    contrasenna:"Contraseñas distintas",
                }),
            }); 
        }
        if(!this.state.errores.hayError){
            try{
                const resp = await this.queriesGenerales.put("/usuario/modificarContrasenna", this.state.campos);
            }catch(error){
                console.log(error);
                this.setState({
                    mensajeError:error.response.data.error,
                    muestraMensajeError:true,
                });
            }
        }
    }

    render(){
        return <form onSubmit={this.modificarContrasenna} className="needs-validation" noValidate>
        <div className="pl-3 pr-3">
          {!this.props.email ? 
          <div className="mb-3 position-relative">
              <label htmlFor="email" className="form-label">Email</label>
              <input type="email" className={this.state.errores.email.length > 0 ? "form-control is-invalid":"form-control"} key="email" name="email" value={this.state.campos.email} required onChange={this.manejaCambio} />
              <div className="invalid-tooltip">
                  {this.state.errores.email}
              </div>
          </div>:
          <></>}
            
            <div className="mb-3 position-relative">
                <label htmlFor="contraseña" className="form-label">Contraseña</label>
                <input type="password" className={this.state.errores.contrasenna.length > 0 ? "form-control is-invalid":"form-control"} key="contraseña" id="contraseña" name="contrasenna" value={this.state.campos.contrasenna} required onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.contrasenna}
                </div>
            </div>
            <div className="mb-3 position-relative">
                <label htmlFor="ccontraseña" className="form-label">Confirmar contraseña</label>
                <input type="password" className={this.state.errores.ccontrasenna.length > 0 ? "form-control is-invalid":"form-control"} key="ccontraseña" id="ccontraseña" name="ccontrasenna" value={this.state.campos.ccontrasenna} required onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.ccontrasenna}
                </div>
            </div>
        </div> 
        <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary btn-lg">Modificar</button>
        </div>
        <div className="d-flex justify-content-end">
            <div style={{position:"fixed"}}>
                <Toast bg="danger" onClose={() => this.setState({muestraMensajeError:false,mensajeError:""})} show={this.state.muestraMensajeError} delay={4000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>{this.state.mensajeError}</Toast.Body>
                </Toast>
            </div>
        </div>
    </form>;
    }
}

export default ContrasennaForm;