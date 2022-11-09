import { useEditor, Element } from '@craftjs/core';

import React from 'react';
import ButtonB from 'react-bootstrap/Button';
import ContainerB from 'react-bootstrap/Container';

import { Button } from './user/Button';
import { Card } from './user/Card';
import { Container } from './user/Container';
import { Text } from './user/Text';

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
    </div>
  );
};
