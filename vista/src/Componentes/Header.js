import { useEditor } from '@craftjs/core';
import React, { useState } from 'react';

import ConfirmaAccion from '../Utilidades/ConfirmaAccion';

import Modal from 'react-bootstrap/Modal';
import { usuarioContexto } from '../usuarioContexto';


export const Header = () => {
  const { actions, query, } = useEditor();

  const [dialogOpen, setDialogOpen] = useState(false);


  return (
    <>
    <usuarioContexto.Consumer>
    {({organizacion})=>{
      return (<div className="d-flex align-items-center justify-content-between m-3">
        <div>
          <h1>Editar sitio</h1>
          <h2 className="ms-3 fs-4">{organizacion.nombre}</h2>
        </div>
          
        <button className="btn btn-primary" onClick={() => {
            setDialogOpen(true);
            const json = query.serialize();
            console.log("json");
            console.log(json);
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
        <ConfirmaAccion
          claseBtn={"btn-primary"}
          titulo={"¿Desea guardar los cambios hechos al sitio?"}
          accion={null}
          cerrarModal={() => setDialogOpen(false)}
          accionNombre="Guardar" />
      </Modal.Body>
    </Modal>
    </>
    
  );
};
