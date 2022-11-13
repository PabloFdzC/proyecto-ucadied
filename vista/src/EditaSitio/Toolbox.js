import { useEditor, Element } from '@craftjs/core';

import React from 'react';
import ButtonB from 'react-bootstrap/Button';
import ContainerB from 'react-bootstrap/Container';

import { Button } from '../Componentes/Button';
import { Card } from '../Componentes/Card';
import { Container } from '../Componentes/Container';
import { Text } from '../Componentes/Text';
import { Video } from '../Componentes/Video';

export const Toolbox = () => {
  const { connectors } = useEditor();

  return (
    <div className="container" style={{overflowY:"scroll"}}>
      <h2>Componentes</h2>
      <ButtonB ref={(ref) =>connectors.create(ref, <Button text="Click me" size="small" />)}>
        Botón
      </ButtonB>
      <ButtonB ref={(ref) => connectors.create(ref, <Text text="Hi world" />)}>
        Texto
      </ButtonB>
      <ButtonB ref={(ref) => connectors.create(ref,<Element canvas is={Container} padding={20} />)}>
        Contenedor
      </ButtonB>
      <ButtonB ref={(ref) => connectors.create(ref, <Card />)}>
        Card
      </ButtonB>
      <ButtonB ref={(ref) => connectors.create(ref, <Video width={420} height={345} src="https://www.youtube.com/embed/jNQXAC9IVRw"/>)}>
        Video
      </ButtonB>
    </div>
  );
};

