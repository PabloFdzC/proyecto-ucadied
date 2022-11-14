import { useEditor } from '@craftjs/core';
import React, { useState, useEffect } from 'react';

import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

import Modal from 'react-bootstrap/Modal';
import { usuarioContexto } from '../usuarioContexto';
import QueriesGenerales from '../QueriesGenerales';
import { Topbar } from './Topbar';

import lz from 'lzutf8';


export const Header = (props) => {
  const { actions, query, } = useEditor();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [nombre, setNombre] = useState("principal");
  const [guardado, setGuardado] = useState(false);
  const [cargado, setCargado] = useState(false);
  const [idSitio, setIdSitio] = useState(null);

  const queriesG = new QueriesGenerales();

  const cargarSitio = async () => {
    try{
      const pagina = await queriesG.obtener("pagina/consultar", {
        id_organizacion: props.idOrganizacion,
        nombre:"Principal",
      });
      if(pagina.data.length > 0){
        const json = lz.decompress(lz.decodeBase64(pagina.data[0].componentes));
        actions.deserialize(json);
        setIdSitio(pagina.data[0].id);
      }
    }catch(error){
      console.log(error);
    }
  };

  const guardar = async () => {
    const sitio = query.serialize();
    const componentes = lz.encodeBase64(lz.compress(sitio));
    try {
      const datos = {
        id_organizacion: props.idOrganizacion,
        nombre,
        componentes,
      };
      if(idSitio){
        await queriesG.postear("pagina/modificar/"+idSitio, datos);
      } else {
        await queriesG.postear("pagina/crear", datos);
      }
      setGuardado(true);
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

  return (
    <>
    <usuarioContexto.Consumer>
    {({organizacion})=>{
      return (<div className="d-flex align-items-center justify-content-between m-3">
        <div>
          <h1>Editar sitio</h1>
          <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
        </div>
        <Topbar />
          
        <button className="btn btn-primary" onClick={() => {
            setDialogOpen(true);
            // Por hacer:
            // Para mostrarlo
            //actions.deserialize(json);
            // Para evitar edición
            // actions.setOptions((options) => (options.enabled = value))
          }}>
            <i className="lni lni-save"></i>  Guardar
          </button>
      </div>);
    }}
    </usuarioContexto.Consumer>
    <Modal
      show={dialogOpen}
      onHide={() => setDialogOpen(false)}
      className="modal-green"
      centered
    >
      <Modal.Body>
        {guardado ? 
          <>
            <h2 className="text-center">Guardado con éxito</h2>
            <div className="d-flex justify-content-end">
              <div className="m-1">
                  <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={() => setDialogOpen(false)}>Volver</button>
              </div>
            </div>
          </>
        :
          <ConfirmaAccion
            claseBtn={"btn-primary"}
            titulo={"¿Desea guardar los cambios hechos al sitio?"}
            accion={guardar}
            cerrarModal={() => setDialogOpen(false)}
            accionNombre="Guardar" /> 
        }
      </Modal.Body>
    </Modal>
    </>
    
  );
};
