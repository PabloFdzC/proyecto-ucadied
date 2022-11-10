import { useNode } from '@craftjs/core';
import React, { useState, useEffect } from 'react';
import ContentEditable from 'react-contenteditable';
import Form from 'react-bootstrap/Form';
import { GlobalTextSettings, GlobalSpacingSettings } from './GlobalSettings';
import { unidades } from './Utilidades/Utilidades';

import Accordion from 'react-bootstrap/Accordion';

export const Text = ({
  tag,
  text,
  textAlign,
  color,
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
  ...props
}) => {
  const {
    connectors: { connect, drag },
    selected,
    actions: { setProp },
  } = useNode((state) => ({
    selected: state.events.selected,
    dragged: state.events.dragged,
  }));

  const [editable, setEditable] = useState(false);

  useEffect(() => {
    if (selected) {
      return;
    }

    setEditable(false);
  }, [selected]);

  return (
    <div
      {...props}
      ref={(ref) => connect(drag(ref))}
      onClick={() => selected && setEditable(true)}
    >
      <ContentEditable
        html={text}
        disabled={!editable}
        onChange={(e) =>
          setProp(
            (props) =>
              (props.text = e.target.value.replace(/<\/?[^>]+(>|$)/g, '')),
            500
          )
        }
        tagName={tag}
        style={{
          color,
          textAlign,
          marginTop:marginTop+marginUnit,
          marginRight:marginRight+marginUnit,
          marginBottom:marginBottom+marginUnit,
          marginLeft:marginLeft+marginUnit,
          paddingTop:paddingTop+paddingUnit,
          paddingRight:paddingRight+paddingUnit,
          paddingBottom:paddingBottom+paddingUnit,
          paddingLeft:paddingLeft+paddingUnit,
        }}
      />
    </div>
  );
};

const TextSettings = () => {
  const {
    tag,
    text,
    color,
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
    tag: node.data.props.tag,
    text: node.data.props.text,
    color: node.data.props.color,
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

  const etiquetas = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
  ];
  return (
    <>
      <Form>
        <div className="mb-3">
          <label htmlFor="text" className="form-label">Etiqueta</label>
          <select
            className="form-select"
            name="etiqueta"
            value={tag}
            onChange={(e) =>{setProp((props) => (props.tag = e.target.value))}}>
              {etiquetas.map((valor, indice)=><option key={indice} value={valor}>{valor}</option>)}
          </select>
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
    </>
  );
};

export const TextDefaultProps = {
  tag: "p",
  text: 'Texto',
  color: '#000000',
  textAlign:'left',
  marginTop:0,
  marginRight:0,
  marginBottom:0,
  marginLeft:0,
  paddingTop:0,
  paddingRight:0,
  paddingBottom:0,
  paddingLeft:0,
  marginUnit:unidades[9],
  paddingUnit:unidades[9],
};

Text.craft = {
  props: TextDefaultProps,
  related: {
    settings: TextSettings,
  },
};
