import { useEditor } from '@craftjs/core';
import React, { useState } from 'react';
import ContainerB from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export const Topbar = () => {
  const { actions, query, canUndo, canRedo } = useEditor(
    (state, query) => ({
      canUndo: query.history.canUndo(),
      canRedo: query.history.canRedo(),
    })
  );

  const [dialogOpen, setDialogOpen] = useState(false);

  const [stateToLoad, setStateToLoad] = useState(null);

  return (
    <>
    <div className="d-flex justify-content-end flex-fill me-4">
      <div className="m-1" style={{width:"fit-content"}}>
        <button
          className="btn btn-dark"
          disabled={!canUndo}
          onClick={() => actions.history.undo()}
          >
            <i className="bi bi-arrow-90deg-left"></i>  Deshacer
        </button>
      </div>
      <div className="m-1" style={{width:"fit-content"}}>
        <button
          className="btn btn-dark"
          disabled={!canRedo}
          onClick={() => actions.history.redo()}>
            <i className="bi bi-arrow-90deg-right"></i>  Restaurar
        </button>
      </div>
    </div>
    </>
    
  );
};
