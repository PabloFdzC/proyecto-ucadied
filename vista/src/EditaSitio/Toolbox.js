import { useEditor, Element } from '@craftjs/core';

import React from 'react';
import ButtonB from 'react-bootstrap/Button';
import ContainerB from 'react-bootstrap/Container';

import { Button } from '../Componentes/Button';
import { Container } from '../Componentes/Container';
import { Text } from '../Componentes/Text';
import { Image } from '../Componentes/Image';
import { Video } from '../Componentes/Video';
import { Contacto } from '../Componentes/Contacto';

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    < >
      <div style={{backgroundColor:"#076321"}}>
        <h4 className="m-2">Componentes</h4>
      </div>
      <div>
      <div className="d-flex m-2" style={{overflowX:"scroll"}}>
        <div className="m-1" style={{width:"fit-content"}}>
          <ButtonB ref={(ref) =>connectors.create(ref, <Button />)}>
            <i className="bi bi-hand-index-thumb"></i>
            Botón
          </ButtonB>
          </div>
          <div className="m-1" style={{width:"fit-content"}}>
            <ButtonB ref={(ref) => connectors.create(ref, <Text />)}>
              <i className="bi bi-fonts"></i>
              Texto
            </ButtonB>
          </div>
          <div className="m-1" style={{width:"fit-content"}}>
            <ButtonB ref={(ref) => connectors.create(ref,
              <Element canvas
                is={Container}
                width={100}
                widthUnit="px"
                widthCustom={true}
                height={100}
                heightUnit="px"
                heightCustom={true}
                backgroundColor="#000" />)}>
              <i className="bi bi-bounding-box"></i>
              Contenedor
            </ButtonB>
          </div>
          <div className="m-1" style={{width:"fit-content"}}>
            <ButtonB ref={(ref) => connectors.create(ref, <Image />)}>
              <i className="bi bi-card-image"></i>
              Imagen
            </ButtonB>
          </div>
          <div className="m-1" style={{width:"fit-content"}}>
            <ButtonB ref={(ref) => connectors.create(ref, <Video />)}>
              <i className="lni lni-video"></i>
              Video
            </ButtonB>
          </div>
          <div className="m-1" style={{width:"fit-content"}}>
            <ButtonB ref={(ref) => connectors.create(ref, <Contacto />)}>
              <i className="bi bi-envelope"></i>
              Contacto
            </ButtonB>
          </div>
        
      </div>
      </div>
      
      
    </>
  );
};

