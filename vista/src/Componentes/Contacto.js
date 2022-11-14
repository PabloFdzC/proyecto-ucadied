import { useNode } from '@craftjs/core';
import Form from 'react-bootstrap/Form';

import React from 'react';
import { GlobalTextSettings, GlobalBackgroundSettings, GlobalSpacingSettings } from './GlobalSettings';
import { unidades } from './Utilidades/Utilidades';

import ContactoForm from '../Organizacion/ContactoForm';
import { usuarioContexto } from '../usuarioContexto';


import Accordion from 'react-bootstrap/Accordion';

export const Contacto = ({
  backgroundColor,
  color,
  ...props
  }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  
  return (
    <div
      ref={(ref) => connect(drag(ref))}
      className="row p-3 m-0"
      style={{backgroundColor, color, width:"100%"}}>
            <h2 className="text-center mb-4" id="contactenos">Contáctenos</h2>
            <div className="col-md-6 col-12 p-0">
                <h3 className="ml-4 mb-4">Información de contacto</h3>
                <div style={{textAlign:"center"}}>
                    <usuarioContexto.Consumer>
                        {({organizacion})=>
                            <ul style={{textAlign:"left", listStyle:"none"}}>
                                <li className="mb-2"><span>Lunes - Viernes:</span> 8:00 a.m - 4:00 p.m</li>
                                <li className="mb-2"><span>Territorio:</span> {organizacion.territorio}</li>
                                <li className="mb-2"><span>Domicilio:</span> {organizacion.domicilio}</li>
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

