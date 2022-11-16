import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';
import {
    fechaAString,
    stringBarrasAFecha,
    fechaAStringSlash,
    stringAFecha
} from '../Utilidades/ManejoFechas';
import Toast from 'react-bootstrap/Toast';

class GastoForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.url = props.url;
        this.campos = props.campos ? props.campos : {};
        this.accion = Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar";
        let fecha = this.campos.fecha ? this.campos.fecha : "";
        if(fecha !== ""){
            // Esto se hace por el formato que trae la fecha
            fecha = fechaAString(stringBarrasAFecha(fecha));
        }
        var campos = {
            id_proyecto:props.idProyecto,
            nombre: this.campos.nombre ? this.campos.nombre : "",
            monto: this.campos.monto ? this.campos.monto.toString() : "",
            fecha: fecha,
            numero_acta: this.campos.numero_acta ? this.campos.numero_acta.toString() : "",
            numero_acuerdo: this.campos.numero_acuerdo ? this.campos.numero_acuerdo.toString() : "",
            proveedor: this.campos.proveedor ? this.campos.proveedor : "",
            numero_factura: this.campos.numero_factura ? this.campos.numero_factura.toString() : "",
            numero_comprobante_pago: this.campos.numero_comprobante_pago ? this.campos.numero_comprobante_pago.toString() : "",
        };
        this.state = {
            titulo: this.accion + " Gasto",
            campos:campos,
            errores: {
                nombre: "",
                monto:"",
                fecha: "",
                numero_acta:"",
                numero_acuerdo:"",
                proveedor: "",
                numero_factura: "",
                numero_comprobante_pago: "",
                hayError: false,
            },
            creado:false,
            muestraMensajeError: false,
            mensajeError:"",
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            monto: "requerido|numeros",
            fecha: "requerido",
            numero_acta:"requerido|numeros",
            numero_acuerdo:"requerido|numeros",
            proveedor: "requerido",
            numero_factura: "requerido|numeros",
            numero_comprobante_pago: "requerido|numeros",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.enviarGasto = this.enviarGasto.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    reiniciarCampos(){
        this.setState({
            titulo: this.accion + " Gasto",
            creado:false,
            campos: Object.assign({},this.state.campos, {
                id_proyecto:this.props.idProyecto,
                nombre: "",
                monto: "",
                fecha: "",
                numero_acta:"",
                numero_acuerdo:"",
                proveedor: "",
                numero_factura: "",
                numero_comprobante_pago: "",
            })
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async enviarGasto(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
          try{
              let resp;
              const campos = {
                id_proyecto:this.props.idProyecto,
                nombre: this.state.campos.nombre,
                monto: this.state.campos.monto,
                fecha: this.state.campos.fecha,
                numero_acta: this.state.campos.numero_acta,
                numero_acuerdo: this.state.campos.numero_acuerdo,
                proveedor: this.state.campos.proveedor,
                numero_factura: this.state.campos.numero_factura,
                numero_comprobante_pago: this.state.campos.numero_comprobante_pago,
              }
              let mensajeExito = "¡Agregado con éxito!";
              let datos;
              if(this.accion === "Agregar"){
                resp = await this.queriesGenerales.postear("/gasto/crear", campos)
                datos = resp.data;
              } else{
                resp = await this.queriesGenerales.modificar("/gasto/modificar/"+this.props.campos.id, campos);
                datos = campos;
                datos.id = this.props.campos.id;
                datos.fecha = fechaAStringSlash(stringAFecha(datos.fecha));
                mensajeExito = "¡Modificado con éxito!";
              }
              this.setState({
                  creado:true,
                  titulo:mensajeExito,
              });
              this.props.avisaCreado(datos);
          }catch(error){
              this.setState({
                muestraMensajeError: true,
                mensajeError:error.response.data,
              });
          }
      }
    }

    render(){
        return (<>
        <h2 className="modal-title text-center">{this.state.titulo}</h2>
        {!this.state.creado ? 
        <form onSubmit={this.enviarGasto} className="needs-validation" noValidate>
          <div className="row">
            <div className="col-12 col-md-6">
              <div className="mb-3 position-relative">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.nombre}
                </div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="fecha" className="form-label">Fecha</label>
                <input type="date" className={this.state.errores.fecha.length > 0 ? "form-control is-invalid":"form-control"} key="fecha" name="fecha" value={this.state.campos.fecha} onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.fecha}
                </div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="monto" className="form-label">Monto</label>
                <input type="text" className={this.state.errores.monto.length > 0 ? "form-control is-invalid":"form-control"} key="monto" name="monto" required value={this.state.campos.monto} onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.monto}
                </div>
              </div>
              <div className="mb-3 position-relative">
                <label htmlFor="proveedor" className="form-label">Proveedor</label>
                <input type="text" className={this.state.errores.proveedor.length > 0 ? "form-control is-invalid":"form-control"} key="proveedor" name="proveedor" required value={this.state.campos.proveedor} onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.proveedor}
                </div>
              </div>
            </div>
            <div className="col-12 col-md-6">
                <div className="mb-3 position-relative">
                    <label htmlFor="numero_factura" className="form-label">Número de factura</label>
                    <input type="text" className={this.state.errores.numero_factura.length > 0 ? "form-control is-invalid":"form-control"} key="numero_factura" name="numero_factura" required value={this.state.campos.numero_factura} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.numero_factura}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="numero_comprobante_pago" className="form-label">Número comprobante de pago</label>
                    <input type="text" className={this.state.errores.numero_comprobante_pago.length > 0 ? "form-control is-invalid":"form-control"} key="numero_comprobante_pago" name="numero_comprobante_pago" required value={this.state.campos.numero_comprobante_pago} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.numero_comprobante_pago}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="numero_acta" className="form-label">Número de acta</label>
                    <input type="text" className={this.state.errores.numero_acta.length > 0 ? "form-control is-invalid":"form-control"} key="numero_acta" name="numero_acta" required value={this.state.campos.numero_acta} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.numero_acta}
                    </div>
                </div>
                <div className="mb-3 position-relative">
                    <label htmlFor="numero_acuerdo" className="form-label">Número de acuerdo</label>
                    <input type="text" className={this.state.errores.numero_acuerdo.length > 0 ? "form-control is-invalid":"form-control"} key="numero_acuerdo" name="numero_acuerdo" required value={this.state.campos.numero_acuerdo} onChange={this.manejaCambio} />
                    <div className="invalid-tooltip">
                        {this.state.errores.numero_acuerdo}
                    </div>
                </div>
            </div>
          </div>
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
            <div style={{position:"fixed", right:0, bottom:0}}>
                <Toast bg="danger" onClose={() => this.setState({muestraMensajeError:false,mensajeError:""})} show={this.state.muestraMensajeError} delay={4000} autohide>
                <Toast.Header>
                    <strong className="me-auto">Error</strong>
                </Toast.Header>
                <Toast.Body>{this.state.mensajeError}</Toast.Body>
                </Toast>
            </div>
        </form>
        :
        <div className="d-flex justify-content-end">
            {this.accion === "Agregar" ? 
                <div className="m-1">
                    <button type="button" className="btn btn-primary" aria-label="Agregar otro" onClick={this.reiniciarCampos}>Agregar otro</button>
                </div>
            :
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
        );
    }
}

export default GastoForm;