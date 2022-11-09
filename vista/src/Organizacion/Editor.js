import { Editor, Frame, Element } from '@craftjs/core';
import React from 'react';
import ContainerB from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import { SettingsPanel } from '../Componentes/SettingsPanel';
import { Toolbox } from '../Componentes/Toolbox';
import { Topbar } from '../Componentes/Topbar';
import { Button } from '../Componentes/user/Button';
import { Card, CardBottom, CardTop } from '../Componentes/user/Card';
import { Container } from '../Componentes/user/Container';
import { Text } from '../Componentes/user/Text';
import { Header } from '../Componentes/Header';

export default function App() {

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
        <Header />
        <div className="row m-0" style={{height:"inherit"}}>
          <div className="col-9" style={{overflowY:"scroll", maxHeight:"100%"}}>
            <Topbar />
            <Frame>
              <Element
                canvas
                is={Container}
                padding={5}
                background="#eeeeee"
                data-cy="root-container"
              >
                <Card data-cy="frame-card" />
                <Button text="Click me" size="small" data-cy="frame-button" />
                <Text fontSize={20} text="Hi world!" data-cy="frame-text" />
                <Element
                  canvas
                  is={Container}
                  padding={6}
                  background="#999999"
                  data-cy="frame-container"
                >
                  <Text
                    size="small"
                    text="It's me again!"
                    data-cy="frame-container-text"
                  />
                </Element>
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