import React from 'react';

function ConfirmaEliminar(props) {
  return (
    <>
    <h2 className="modal-title text-center">{props.titulo}</h2>
    <div className="d-flex justify-content-end">
        <div className="m-1">
            <button type="button" className="btn btn-secondary" aria-label="Volver" onClick={props.cerrarModal}>Volver</button>
        </div>
        <div className="m-1">
          <button type="button" className="btn btn-danger" aria-label="Eliminar" onClick={props.eliminar}>Eliminar</button>
        </div>
    </div>
    </>
  );
}

export default ConfirmaEliminar;