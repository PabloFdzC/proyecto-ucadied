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
import { Image } from '../Componentes/Image';
import { Video } from '../Componentes/Video';
import { Contacto } from '../Componentes/Contacto';

import QueriesGenerales from '../QueriesGenerales';

const loremIpsum = `Lorem ipsum dolor sit amet, consectetur
adipiscing elit, sed do eiusmod tempor incididunt ut labore
et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate
velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
occaecat cupidatat non proident, sunt in culpa qui officia
deserunt mollit anim id est laborum`;

export default function App(props) {

  return (
      <Editor
        resolver={{
          Card,
          Button,
          Text,
          Container,
          CardTop,
          CardBottom,
          Image,
          Video,
          Contacto,
        }}
      >
        <Header idOrganizacion={props.idOrganizacion} />
        <div className="d-flex overflow-hidden" style={{height:"inherit", maxHeight:"inherit"}}>
          <div className="w-100" style={{overflowY:"scroll", maxHeight:"100%"}}>
            <Frame>
              <Element
                canvas
                is={Container}
                data-cy="root-container" >
                <Element
                  canvas
                  is={Container}
                  type="row" >
                    <Element
                      canvas
                      is={Container}
                      width={100}
                      widthCustom={true}
                      widthUnit="%"
                      type="column" >
                        <Image />
                        <Element
                          canvas
                          is={Container}
                          width={100}
                          widthCustom={true}
                          widthUnit="%"
                          type="row" >
                            <Element
                            canvas
                            is={Container}
                            backgroundColor="#D1992C"
                            paddingTop={0.375}
                            paddingRight={0.75}
                            paddingBottom={0.375}
                            paddingLeft={0.75}
                            type="column" >
                                <Text
                                  tag="h4"
                                  color="#FFFFFF"
                                  text="Asociaciones de Desamparados" />
                                <Button
                                  text="Asociaciones"
                                  url="/asociaciones"
                                  backgroundColor="#160C28"
                                  color="#FCE762" /> 
                            </Element>
                            <Element
                            canvas
                            is={Container}
                            backgroundColor="#137E31"
                            paddingTop={0.375}
                            paddingRight={0.75}
                            paddingBottom={0.375}
                            paddingLeft={0.75}
                            type="column" >
                                <Text
                                  tag="h4"
                                  color="#FFFFFF"
                                  text="Contáctenos"
                                  textAlign="center" />
                                <Button
                                  text="Contactar"
                                  url="#contactenos"
                                  backgroundColor="#FCE762" /> 
                            </Element>
                        </Element>
                    </Element>
                    <Element
                      canvas
                      is={Container}
                      type="column" >
                        <Element
                          canvas
                          is={Container}
                          backgroundColor="#194777"
                          paddingTop={0.375}
                          paddingRight={0.75}
                          paddingBottom={0.375}
                          paddingLeft={0.75}
                          height={100}
                          heightUnit="%"
                          heightCustom={true}
                          type="column" >
                            <Text
                              tag="h4"
                              color="#FFFFFF"
                              text="¿Quiénes somos?"
                              textAlign="center" />
                            <Text tag="p" color="#FFFFFF" text={loremIpsum} data-cy="frame-text" />
                        </Element>
                        <Element
                          canvas
                          is={Container}
                          backgroundColor="#76B2CE"
                          paddingTop={0.375}
                          paddingRight={0.75}
                          paddingBottom={0.375}
                          paddingLeft={0.75}
                          height={100}
                          heightUnit="%"
                          heightCustom={true}
                          type="column" >
                            <Text
                              tag="h4"
                              color="#160C28"
                              text="¿Qué hacer en Desamparados?"
                              textAlign="center" />
                            <Text
                              tag="p"
                              color="#160C28"
                              text={loremIpsum} />
                        </Element>
                    </Element>
                </Element>
                <Element
                  canvas
                  is={Container}
                  type="row" >
                    <Element
                      canvas
                      is={Container}
                      backgroundColor="#9E1327"
                      width={100}
                      widthUnit="%"
                      widthCustom={true}
                      paddingTop={0.375}
                      paddingRight={0.75}
                      paddingBottom={0.375}
                      paddingLeft={0.75}
                      type="column" >
                        <Text
                          tag="h4"
                          color="#FFFFFF"
                          text="Noticias"
                          textAlign="center" />
                    </Element>
                </Element>
                <Element
                  canvas
                  is={Container}
                  type="row" >
                    <Element
                      canvas
                      is={Container}
                      backgroundColor="#DFBF1D"
                      width={100}
                      widthUnit="%"
                      widthCustom={true}
                      paddingTop={0.375}
                      paddingRight={0.75}
                      paddingBottom={0.375}
                      paddingLeft={0.75}
                      type="column" >
                        <Text
                          tag="h4"
                          color="#160C28"
                          text="Historia"
                          textAlign="center" />
                          <Text tag="p" color="#160C28" text={loremIpsum} data-cy="frame-text" />
                    </Element>
                </Element>
                <Element
                  canvas
                  is={Container}
                  type="row" >
                    <Contacto />
                </Element>
              </Element>
            </Frame>
          </div>
          <div className="d-flex flex-column overflow-hidden" style={{backgroundColor:"#137E31", color:"#FFFFFF",maxHeight:"100%"}}>
            <Toolbox />
            <SettingsPanel />
          </div>
        </div>
        
        
      </Editor>
  );
}