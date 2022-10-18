import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';

class GastoForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.url = props.url;
        this.titulo = "Agregar Gasto";
        var campos = {
            id_proyecto:props.idProyecto,
            nombre: "",
            monto: "",
            fecha: "",
            numero_acta:"",
            numero_acuerdo:"",
        };
        this.state = {
            titulo: this.titulo,
            campos:campos,
            errores: {
                nombre: "",
                monto:"",
                fecha: "",
                numero_acta:"",
                numero_acuerdo:"",
                hayError: false,
            },
            creado:false,
        };
        this.validacion = new Validacion({
            nombre: "requerido",
            monto: "requerido|numeros",
            fecha: "requerido",
            numero_acta:"requerido|numeros",
            numero_acuerdo:"requerido|numeros",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.crearGasto = this.crearGasto.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
    }

    reiniciarCampos(){
        this.setState({
            titulo: this.titulo,
            creado:false,
            campos: Object.assign({},this.state.campos, {
                id_proyecto:this.props.idProyecto,
                nombre: "",
                monto: "",
                fecha: "",
                numero_acta:"",
                numero_acuerdo:"",
            })
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async crearGasto(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
          try{
              const resp = await this.queriesGenerales.postear("/gasto/crear", this.state.campos);
              this.setState({
                  creado:true,
                  titulo:"¡Agregado con éxito!",
              });
              this.props.avisaCreado(resp.data);
          }catch(error){
              console.log(error);
          }
      }
    }

    render(){
        return (<>
        <h2 className="modal-title text-center">{this.state.titulo}</h2>
        {!this.state.creado ? 
        <form onSubmit={this.crearGasto} className="needs-validation" noValidate>
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
            </div>
            <div className="col-12 col-md-6">
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
                    <button type="submit" className="btn btn-primary">Agregar</button>
                </div>
            </div>
        </form>
        :
        <div className="d-flex justify-content-end">
            <div className="m-1">
                <button type="button" className="btn btn-primary" aria-label="Agregar otro" onClick={this.reiniciarCampos}>Agregar otro</button>
            </div>
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