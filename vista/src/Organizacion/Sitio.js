import React, { useState, useEffect } from 'react';

import { Editor, Frame, useEditor } from '@craftjs/core';

import { Button } from '../Componentes/Button';
import { Card, CardBottom, CardTop } from '../Componentes/Card';
import { Container } from '../Componentes/Container';
import { Text } from '../Componentes/Text';
import QueriesGenerales from '../QueriesGenerales';

import lz from 'lzutf8';

const SitioCargado = (props) => {
  const { actions } = useEditor();
  const [cargado, setCargado] = useState(false);
  const [componentes, setComponentes] = useState("");
  const queriesG = new QueriesGenerales();

  const cargarSitio = async () => {
    try {
      const pagina = await queriesG.obtener("pagina/consultar", {
        id_organizacion: props.idOrganizacion,
        nombre: props.nombre
      });
      if(pagina.data.length > 0){
        const json = lz.decompress(lz.decodeBase64(pagina.data[0].componentes));
        //setComponentes(json);
        actions.deserialize(json);
      } else {
        console.log("NO");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function cargar(){
      await cargarSitio(props.idOrganizacion);
    }
    cargar();
  },[cargado]);


  return <></>;
}

export default function Sitio(props){
  const [cargado, setCargado] = useState(false);


  useEffect(() => {
      async function cargar(){
        await props.cargarOrganizacion(props.idOrganizacion);
      }
      
      document.title = props.nombre;
      cargar();
  },[cargado]);


  return (
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
      <SitioCargado idOrganizacion={props.idOrganizacion} nombre={props.nombre} />
      <Frame>
          
      </Frame>
      
      
    </Editor>
  );

}