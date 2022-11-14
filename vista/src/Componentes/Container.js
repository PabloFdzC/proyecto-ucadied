import { useNode } from '@craftjs/core';
import React from 'react';
import ContainerB from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { GlobalBackgroundSettings, GlobalSpacingSettings, GlobalDimensionsSettings } from './GlobalSettings';
import { manejaCambio, unidades } from './Utilidades/Utilidades';

import Accordion from 'react-bootstrap/Accordion';

export const Container = ({
  width,
  widthUnit,
  widthCustom,
  height,
  heightUnit,
  heightCustom,
  backgroundColor,
  children,
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
  type,
  justify,
  align,
  ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  let className = "d-flex ";
  if(type){
    className += "flex-"+type + " ";
  }
  if(justify){
    className += "justify-content-" + justify + " ";
  }
  width += widthCustom ? widthUnit : "";
  height += heightCustom ? heightUnit : "";
  return (
    <div
      {...props}
      ref={(ref) => connect(drag(ref))}
      className={className}
      style={{
        width:width,
        height,
        backgroundColor,
        opacity:opacity/100,
        marginTop:marginTop+marginUnit,
        marginRight:marginRight+marginUnit,
        marginBottom:marginBottom+marginUnit,
        marginLeft:marginLeft+marginUnit,
        paddingTop:paddingTop+paddingUnit,
        paddingRight:paddingRight+paddingUnit,
        paddingBottom:paddingBottom+paddingUnit,
        paddingLeft:paddingLeft+paddingUnit,
       }}
    >
      {children}
    </div>
  );
};

export const ContainerSettings = () => {
  const {
    width,
    widthUnit,
    widthCustom,
    height,
    heightUnit,
    heightCustom,
    backgroundColor,
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
    type,
    justify,
    align,
    actions: { setProp },
  } = useNode((node) => ({
    width:node.data.props.width,
    widthUnit:node.data.props.widthUnit,
    widthCustom:node.data.props.widthCustom,
    height:node.data.props.height,
    heightUnit:node.data.props.heightUnit,
    heightCustom:node.data.props.heightCustom,
    backgroundColor: node.data.props.backgroundColor,
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
    type:node.data.props.type,
    justify:node.data.props.justify,
    align:node.data.props.align,
  }));

  const justificado = ["", "start", "end", "center", "between", "around", "evenly"];
  const justificadoES = ["Por defecto","Inicio", "Final", "Centro", "En medio", "Alrededor", "Iguales"];
  const alinear = ["", "start", "end", "center", "baseline", "stretch"];
  const alinearES = ["Por defecto","Inicio", "Final", "Centro", "Línea base", "Estirar"];
  return (
    <>
      <Form >
        <h5>Acomodo de elementos</h5>
        <div className="mb-3">
          <div className="form-check form-check-inline">
            <input checked={type === "row"} className="form-check-input" type="radio" name="type" id="row" value="row" onChange={(e) => manejaCambio(setProp, "type", e)} />
            <label className="form-check-label" htmlFor="row">Horizontal</label>
          </div>
          <div className="form-check form-check-inline">
            <input checked={type === "column"} className="form-check-input" type="radio" name="type" id="column" value="column" onChange={(e) => manejaCambio(setProp, "type", e)} />
            <label className="form-check-label" htmlFor="column">Vertical</label>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="justify" className="form-label">Justificar contenido</label>
          <select
            className="form-select"
            name="justify"
            id="justify"
            value={justify}
            onChange={(e) => manejaCambio(setProp, "justify", e)} >
              {justificado.map((valor, indice)=><option key={indice} value={valor}>{justificadoES[indice]}</option>)}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="align" className="form-label">Alinear contenido</label>
          <select
            className="form-select"
            name="align"
            id="align"
            value={align}
            onChange={(e) => manejaCambio(setProp, "align", e)} >
              {alinear.map((valor, indice)=><option key={indice} value={valor}>{alinearES[indice]}</option>)}
          </select>
        </div>
        <Accordion>
          <Accordion.Item eventKey="Dimensiones">
            <Accordion.Header>Dimensiones</Accordion.Header>
            <Accordion.Body>
            <GlobalDimensionsSettings
                setProp={setProp}
                unitName="widthUnit"
                id="width"
                value={width}
                unit={widthUnit}
                name="Ancho"
                custom={widthCustom}
                customName="widthCustom" />
            <GlobalDimensionsSettings
                setProp={setProp}
                unitName="heightUnit"
                id="height"
                value={height}
                unit={heightUnit}
                name="Alto"
                custom={heightCustom}
                customName="heightCustom" />
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
    </>
  );
};

export const ContainerDefaultProps = {
  backgroundColor: '#ffffff',
  opacity:100,
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
  type:"column",
  width:"",
  widthCustom:false,
  widthUnit:unidades[14],
  height:"",
  heightCustom:false,
  heightUnit:unidades[14],
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
