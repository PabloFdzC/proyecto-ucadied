import { useNode } from '@craftjs/core';
import React from 'react';
import ContainerB from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import { GlobalBackgroundSettings, GlobalSpacingSettings } from '../GlobalSettings';
import { unidades } from '../Utilidades';

import Accordion from 'react-bootstrap/Accordion';

export const Container = ({
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
  ...props }) => {
  const {
    connectors: { connect, drag },
  } = useNode();
  return (
    <ContainerB
      {...props}
      ref={(ref) => connect(drag(ref))}
      style={{
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
    </ContainerB>
  );
};

export const ContainerSettings = () => {
  const {
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
    actions: { setProp },
  } = useNode((node) => ({
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
  }));

  return (
    <>
      <Form >
        <Accordion>
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
  paddingTop:0.375,
  paddingRight:0.75,
  paddingBottom:0.375,
  paddingLeft:0.75,
  marginUnit:unidades[9],
  paddingUnit:unidades[9],
};

Container.craft = {
  props: ContainerDefaultProps,
  related: {
    settings: ContainerSettings,
  },
};
