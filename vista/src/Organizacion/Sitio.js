import React, { useState, useEffect } from 'react';

import { Editor, Frame, useEditor } from '@craftjs/core';

import { Button } from '../Componentes/Button';
import { Container } from '../Componentes/Container';
import { Text } from '../Componentes/Text';
import { Image } from '../Componentes/Image';
import { Video } from '../Componentes/Video';
import { Contacto } from '../Componentes/Contacto';

import QueriesGenerales from '../QueriesGenerales';

import lz from 'lzutf8';

import { Link } from 'react-router-dom';

const SitioCargado = (props) => {
  const { actions } = useEditor();
  const [cargado, setCargado] = useState(false);
  const [mensaje, setMensaje] = useState("");
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
        setMensaje("Se debe crear el sitio");
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


  return <>
      {mensaje.length > 0?
        <div className="d-flex flex-column center-text justify-content-center align-items-center" style={{height:"inherit"}}>
          <h1>{mensaje}</h1>
          <div>
              <Link className="btn btn-primary" to={"/editarSitio/"+props.idOrganizacion}>Editar Sitio</Link>
          </div>
        </div>
      :<></>}
  </>;
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
          Button,
          Text,
          Container,
          Image,
          Video,
          Contacto,
        }}
      >
        <SitioCargado idOrganizacion={props.idOrganizacion} nombre={props.nombre} />
        <Frame>
            
        </Frame>
        
        
      </Editor>);
}