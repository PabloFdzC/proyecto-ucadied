import React from 'react';

function ConfirmaAccion(props) {
  return (
    <>
    <h3 className="text-center">{props.titulo}</h3>
    <div className="d-flex justify-content-end">
        <div className="m-1">
            <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={props.cerrarModal}>Volver</button>
        </div>
        <div className="m-1">
          <button type="button" className={"btn " + props.claseBtn} aria-label="Accion" onClick={props.accion}>{props.accionNombre}</button>
        </div>
    </div>
    </>
  );
}

export default ConfirmaAccion;