import React from 'react';
import QueriesGenerales from "../QueriesGenerales";
import manejarCambio from '../Utilidades/manejarCambio';
import Validacion from '../Utilidades/Validacion';
import listaHoras from '../Utilidades/listaHoras';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Toast from 'react-bootstrap/Toast';
import Select from 'react-select';
import { horaAFecha } from '../Utilidades/ManejoHoras';

/*
Recibe los props:
campos: Objeto con la forma de los campos (es opcional porque solo se ocupa
    si se va a usar el formulario para editar la organización)
avisaCreado: Función que permite enviar la información del formulario
    al componente que sea el padre del componente actual (o sea este),
    se usa para actualizar la tabla con la información que se agrega
    cuando se envía el formulario
cerrarModal: Función para que se cierre el modal que contiene al formulario
    entonces solo si se pone en un modal es necesaria
*/
class InmuebleForm extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.horas = listaHoras();
        this.diasLetra = ["D","L","K","M","J","V","S"];
        var horario = this.diasLetra.map((letra)=>{return {dia:letra,inicio:"",final:""}});
        var horarioErrores = this.diasLetra.map((letra)=>{return {inicio:"",final:""}});
        this.campos = props.campos ? props.campos : {};
        if(this.campos.horario){
          for(let i = 0; i < this.campos.horario.length; i++){
            for(let j = 0; j < horario.length; j++){
              if(this.campos.horario[i].dia === horario[j].dia){
                horario[j].inicio = {
                  value:this.campos.horario[i].inicio,
                  label:this.campos.horario[i].inicioBonito,
                };
                horario[j].final = {
                  value:this.campos.horario[i].final,
                  label:this.campos.horario[i].finalBonito,
                };
              }
            }
          }
        }
        this.accion = (Object.entries(this.campos).length > 0 ? "Modificar" : "Agregar");
        this.titulo = "Inmueble";
        var campos = {
            id_organizacion:props.idOrganizacion,
            nombre: this.campos.nombre ? this.campos.nombre : "",
            horario: horario,
        };
        this.state = {
            titulo: this.accion + " " +this.titulo,
            campos:campos,
            key:this.diasLetra[0],
            errores: {
                nombre: "",
                horario:horarioErrores,
                hayError: false,
            },
            muestraMensajeError:false,
            mensajeError:false,
            creado:false,
        };
        this.validacion = new Validacion({
            nombre: "requerido",
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.enviarInmueble = this.enviarInmueble.bind(this);
        this.reiniciarCampos = this.reiniciarCampos.bind(this);
        this.manejaCambioHorario = this.manejaCambioHorario.bind(this);
    }

    manejaCambioHorario(indice, nombre, valor){
      let horarios = [...this.state.campos.horario];
      let errores = [...this.state.errores.horario];
      let horario = {...horarios[indice]};
      let error = {...errores[indice]};
      horario[nombre] = valor ? valor : "";
      error.inicio = "";
      error.final = "";
      horarios[indice] = horario;
      errores[indice] = error;
      this.setState({
        campos: Object.assign({}, this.state.campos, {
          horario: horarios,
        }),
        errores: Object.assign({}, this.state.errores, {
          horario: errores,
        }),
      });
    }

    reiniciarCampos(){
        this.setState({
            titulo: this.accion + " " +this.titulo,
            creado:false,
            campos: Object.assign({},this.state.campos, {
                nombre: "",
                horario: this.diasLetra.map((letra)=>{return {dia:letra,inicio:"",final:""}}),
            })
        });
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async validarHorario(){
      var errores = [...this.state.errores.horario];
      var llenos = 0;
      var hayError = false;
      for (let i = 0; i < this.state.campos.horario.length; i++){
        if(this.state.campos.horario[i].inicio && this.state.campos.horario[i].final){
          if(this.state.campos.horario[i].inicio.value !== "" && this.state.campos.horario[i].inicio.value && this.state.campos.horario[i].final.value !== "" && this.state.campos.horario[i].final.value){
            llenos++;
            var r = this.validacion.horaInicialFinalCorrectas(this.state.campos.horario[i].inicio.value,this.state.campos.horario[i].final.value);
            if(r.inicio !== "" && r.final !== ""){
              var error = {...errores[i]};
              error.inicio = r.inicio;
              error.final = r.final;
              errores[i] = error;
              hayError = true;
            }
          }
        }
      }
      if(llenos === 0){
        await this.setState({
          errores: Object.assign({},this.state.errores, {
            hayError:true,
          }),
          muestraMensajeError:true,
          mensajeError:"Debe existir al menos un horario",
        });
      } else if(hayError){
        await this.setState({
          errores: Object.assign({},this.state.errores, {
            horario:errores,
            hayError:true,
          }),
        });
      }
    }

    async enviarInmueble(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        await this.validarHorario();
        if(!this.state.errores.hayError){
          var campos = {
            nombre:this.state.campos.nombre,
            id_organizacion: this.props.idOrganizacion,
          };
          var horario = [];
          for (let h of this.state.campos.horario){
            if(h.inicio.value !== "" && h.inicio.value && h.final.value !== "" && h.final.value){
              horario.push({
                dia:h.dia,
                inicio:horaAFecha(h.inicio.value).toUTCString(),
                final:horaAFecha(h.final.value).toUTCString(),
              });
            }
          }
          campos.horario = horario;
          try{
              var resp;
              var mensajeExito = "¡Agregado con éxito!";
              if(this.accion === "Agregar"){
                resp = await this.queriesGenerales.postear("/inmueble/crear", campos);
              } else {
                resp = await this.queriesGenerales.modificar("/inmueble/modificar/"+this.campos.id, campos);
                mensajeExito = "¡Modificado con éxito!";
              }
              this.setState({
                  creado:true,
                  titulo:mensajeExito,
              });
              if(this.accion === "Agregar")
                this.props.avisaCreado(resp.data);
              else{
                campos.id = this.campos.id;
                this.props.avisaCreado(campos);
              }
          }catch(error){
              console.log(error);
          }
        }
    }

    render(){
        return (<>
        <h2 className="modal-title text-center">{this.state.titulo}</h2>
        {!this.state.creado ? 
        <form onSubmit={this.enviarInmueble} className="needs-validation" noValidate>
          <div className="row">
            <div className="col-12 ">
              <div className="mb-3 position-relative">
                <label htmlFor="nombre" className="form-label">Nombre</label>
                <input type="text" className={this.state.errores.nombre.length > 0 ? "form-control is-invalid":"form-control"} key="nombre" name="nombre" required value={this.state.campos.nombre} onChange={this.manejaCambio} />
                <div className="invalid-tooltip">
                    {this.state.errores.nombre}
                </div>
              </div>
              <h4>Horario de disponibilidad</h4>
              <Tab.Container id="left-tabs-example" activeKey={this.state.key} onSelect={(key) => this.setState({key})}>
                <Row>
                    <Nav variant="pills" className="justify-content-center">
                      {this.diasLetra.map((valor,i)=>
                        <Nav.Item key={i}>
                          <Nav.Link key={"nl"+i} eventKey={valor}>{valor}</Nav.Link>
                      </Nav.Item>
                      )}
                    
                    </Nav>
                </Row>
                <Row>
                    <Tab.Content>
                    {this.diasLetra.map((valor,i)=>
                      <Tab.Pane key={i} eventKey={valor}>
                        <div className="row">
                          <div className="col">
                            <div className="mb-3 position-relative">
                              <label htmlFor="inicio" className="form-label">Apertura</label>
                              <div className={this.state.errores.horario[i].inicio.length > 0 ? "p-0 form-control is-invalid":"p-0 form-control"}>
                              <Select 
                              isClearable
                              key="inicio" name="inicio" value={this.state.campos.horario[i].inicio} onChange={(opcion)=>this.manejaCambioHorario(i,"inicio",opcion)}
                              options={this.horas}
                              />
                              </div>
                              <div className="invalid-tooltip">
                                  {this.state.errores.horario[i].inicio}
                              </div>
                            </div>
                          </div>
                          <div className="col">
                            <div className="mb-3 position-relative">
                              <label htmlFor="final" className="form-label">Cierre</label>
                              <div className={this.state.errores.horario[i].final.length > 0 ? "p-0 form-control is-invalid":"p-0 form-control"}>
                              <Select 
                              isClearable
                              key="final" name="final" value={this.state.campos.horario[i].final} onChange={(opcion)=>this.manejaCambioHorario(i,"final",opcion)}
                              options={this.horas}
                              />
                              </div>
                              <div className="invalid-tooltip">
                                  {this.state.errores.horario[i].final}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Tab.Pane>
                      )}
                    </Tab.Content>
                </Row>
            </Tab.Container>
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
        </form>
        :
        <div className="d-flex justify-content-end">
            {this.accion === "Agregar" ? <div className="m-1">
                <button type="button" className="btn btn-primary" aria-label="Agregar otro" onClick={this.reiniciarCampos}>Agregar otro</button>
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
        );
    }
}

export default InmuebleForm;