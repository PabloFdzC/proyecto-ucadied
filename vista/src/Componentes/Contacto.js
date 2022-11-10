import { useNode } from '@craftjs/core';
import Form from 'react-bootstrap/Form';

import React from 'react';
import { GlobalTextSettings, GlobalBackgroundSettings, GlobalSpacingSettings } from './GlobalSettings';
import { unidades } from './Utilidades/Utilidades';

import ContactoForm from '../Organizacion/ContactoForm';

export const Contacto = ({
  backgroundColor,
  color,
  ...props
  }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  let className = "btn ";
  if(tamanno && tamanno !== ""){
    className += "btn-"+tamanno;
  }
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="row p-3"
      style={{backgroundColor, color}}>
            <h2 className="text-center mb-4">Contáctenos</h2>
            <div className="col-md-6 col-12 p-0">
                <h3 className="ml-4 mb-4">Información de contacto</h3>
                <div style={{textAlign:"center"}}>
                    <usuarioContexto.Consumer>
                        {({organizacion})=>
                            <ul style={{textAlign:"left", listStyle:"none"}}>
                                <li className="mb-2"><span>Lunes - Viernes:</span> 8:00 a.m - 4:00 p.m</li>
                                <li className="mb-2"><span>Territorio:</span> {organizacion.territorio}</li>
                                <li className="mb-2"><span>Lugar:</span> {organizacion.lugar}</li>
                                <li className="mb-2"><span>Email:</span> {organizacion.email}</li>
                                <li className="mb-2"><span>Teléfono:</span> {organizacion.telefonos}</li>
                            </ul>
                        }
                    </usuarioContexto.Consumer>
                </div>
            </div>

            <div className="col-md-6 col-12 p-0">
                <ContactoForm />
            </div>
    
        </div>
  );
};

export const ContactoSettings = () => {
  
  const {
    tamanno,
    backgroundColor,
    text,
    color,
    opacity,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginUnit,
    paddingUnit,
    actions: { setProp },
  } = useNode((node) => ({
    tamanno:node.data.props.tamanno,
    backgroundColor:node.data.props.backgroundColor,
    text:node.data.props.text,
    color:node.data.props.color,
    opacity:node.data.props.opacity,
    marginTop:node.data.props.marginTop,
    marginRight:node.data.props.marginRight,
    marginBottom:node.data.props.marginBottom,
    marginLeft:node.data.props.marginLeft,
    paddingTop:node.data.props.paddingTop,
    paddingRight:node.data.props.paddingRight,
    paddingBottom:node.data.props.paddingBottom,
    paddingLeft:node.data.props.paddingLeft,
    marginUnit:node.data.props.marginUnit,
    paddingUnit:node.data.props.paddingUnit,
  }));

  return (
    <div>
      <Form>
        <div className="mb-3 position-relative">
          <label htmlFor="text" className="form-label">Tamaño</label>
          <div>
            <Form.Check
              label="Pequeño"
              name="tamanno"
              type="radio"
              checked={tamanno === "sm"}
              onChange={(e) =>{setProp((props) => (props.tamanno = "sm"))}}
            />
            <Form.Check
              label="Mediano"
              name="tamanno"
              type="radio"
              checked={tamanno === ""}
              onChange={(e) => setProp((props) => (props.tamanno = ""))}
            />
            <Form.Check
              label="Grande"
              name="tamanno"
              type="radio"
              checked={tamanno === "lg"}
              onChange={(e) => setProp((props) => (props.tamanno = "lg"))}
            />
          </div>
        </div>
        <Accordion>
          <Accordion.Item eventKey="Texto">
            <Accordion.Header>Texto</Accordion.Header>
            <Accordion.Body>
              <GlobalTextSettings
                setProp={setProp}
                text={text}
                color={color} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="Fondo">
            <Accordion.Header>Fondo</Accordion.Header>
            <Accordion.Body>
              <GlobalBackgroundSettings
                setProp={setProp}
                backgroundColor={backgroundColor}
                opacity={opacity} />
            </Accordion.Body>
          </Accordion.Item>
          <Accordion.Item eventKey="Espaciado">
            <Accordion.Header>Espaciado</Accordion.Header>
            <Accordion.Body>
              <GlobalSpacingSettings
                setProp={setProp}
                marginTop={marginTop}
                marginRight={marginRight}
                marginBottom={marginBottom}
                marginLeft={marginLeft}
                paddingTop={paddingTop}
                paddingRight={paddingRight}
                paddingBottom={paddingBottom}
                paddingLeft={paddingLeft}
                marginUnit={marginUnit}
                paddingUnit={paddingUnit} />
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
        
        
      

      </Form>
    </div>
  );
};

export const ContactoDefaultProps = {
  tamanno: '',
  backgroundColor: '#137E31',
  text: 'Botón',
  color: '#FFFFFF',
  opacity:100,
  marginTop:0,
  marginRight:0,
  marginBottom:0,
  marginLeft:0,
  paddingTop:0.375,
  paddingRight:0.75,
  paddingBottom:0.375,
  paddingLeft:0.75,
  marginUnit:unidades[9],
  paddingUnit:unidades[9],
};

Contacto.craft = {
  props: ContactoDefaultProps,
  related: {
    settings: ContactoSettings,
  },
};


class Contactenos extends React.Component {
    constructor(props){
        super(props);
        this.queriesGenerales = new QueriesGenerales();
        this.organizacionPedida = false;
        var campos = {
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
            nombre: "requerido",
            email: "requerido",
            telefono: "requerido",
            mensaje: "requerido"
        }, this);

        this.manejaCambio = this.manejaCambio.bind(this);
        this.enviarMensaje = this.enviarMensaje.bind(this);
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

    // Hay que hacerla
    enviarMensaje(){

    }

    async cargarOrganizacion(){
        try{
            const resp = await this.queriesGenerales.obtener("/organizacion/consultar/"+this.props.idOrganizacion, {});
            this.setState({
                territorio: resp.data[0].territorio,
                email:(resp.data[0].email),
                telefonos: resp.data[0].telefonos
            });
        } catch(err){
            console.log(err);
        }
    }

    componentDidMount() {
        if(!this.organizacionPedida){
            this.organizacionPedida = true;
            this.cargarOrganizacion();
        }
    }

    manejaCambio(evento){
        manejarCambio(evento, this);
    }

    async enviarMensaje(evento){
        evento.preventDefault();
        this.validacion.validarCampos(this.state.campos);
        if(!this.state.errores.hayError){
            try{
                var resp = await this.queriesGenerales.postear("/enviarMensaje", this.state.campos);
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

    async avisaCreado(asociacion){
        await this.props.avisaCreado(asociacion);
    }


    render(){
        return (   
        <div className="row p-3" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
            <h2 className="text-center mb-4">Contáctenos</h2>
            <div className="col-md-6 col-12 p-0">
                <h3 className="ml-4 mb-4">Información de contacto</h3>
                <div style={{textAlign:"center"}}>
                    <usuarioContexto.Consumer>
                        {({organizacion})=>
                            <ul style={{textAlign:"left", listStyle:"none"}}>
                                <li className="mb-2"><span>Lunes - Viernes:</span> 8:00 a.m - 4:00 p.m</li>
                                <li className="mb-2"><span>Territorio:</span> {organizacion.territorio}</li>
                                <li className="mb-2"><span>Lugar:</span> {organizacion.lugar}</li>
                                <li className="mb-2"><span>Email:</span> {organizacion.email}</li>
                                <li className="mb-2"><span>Teléfono:</span> {organizacion.telefonos}</li>
                            </ul>
                        }
                    </usuarioContexto.Consumer>
                </div>
            </div>

            <div className="col-md-6 col-12 p-0">
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
                    <div className="d-flex justify-content-end">
                        <div className="m-1">
                            <button type="submit" className="btn btn-primary">Enviar</button>
                        </div> 
                    </div> 
                </form>
            </div>
    
        </div>
        );
    }
}

export default Contactenos;