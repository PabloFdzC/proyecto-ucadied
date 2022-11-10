import { Editor, Frame, Element } from '@craftjs/core';
import React from 'react';
import ContainerB from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SettingsPanel } from './SettingsPanel';
import { Toolbox } from './Toolbox';
import { Topbar } from './Topbar';
import { Button } from '../Componentes/Button';
import { Card, CardBottom, CardTop } from '../Componentes/Card';
import { Container } from '../Componentes/Container';
import { Text } from '../Componentes/Text';
import { Header } from './Header';

export default function App(props) {

  return (
    <div style={{overflow:"none"}}>
      <Editor
        resolver={{
          Card,
          Button,
          Text,
          Container,
          CardTop,
          CardBottom,
        }}
      >
        <Header idOrganizacion={props.idOrganizacion} />
        <div className="row m-0" style={{height:"inherit"}}>
          <div className="col-9" style={{overflowY:"scroll", maxHeight:"100%"}}>
            <Topbar />
            <Frame>
              <Element
                canvas
                is={Container}
                backgroundColor="#EF2917"
                data-cy="root-container"
              >
                <Text fontSize={20} color="#FFFFFF" text="Hola mundo!" data-cy="frame-text" />
                <Button text="Mi botón" size="small" data-cy="frame-button" />
              </Element>
            </Frame>
          </div>
          <div className="col-3 p-0" style={{backgroundColor:"#137E31", color:"#FFFFFF"}}>
            <Toolbox />
            <SettingsPanel />
          </div>
        </div>
        
        
      </Editor>
    </div>
  );
}