import { useEditor } from '@craftjs/core';

import React from 'react';
import ButtonB from 'react-bootstrap/Button';
import ContainerB from 'react-bootstrap/Container';
import Badge from 'react-bootstrap/Badge';

export const SettingsPanel = () => {
  const { actions, selected, isEnabled } = useEditor((state, query) => {
    const currentNodeId = query.getEvent('selected').last();
    let selected;

    if (currentNodeId) {
      selected = {
        id: currentNodeId,
        name: state.nodes[currentNodeId].data.name,
        settings:
          state.nodes[currentNodeId].related &&
          state.nodes[currentNodeId].related.settings,
        isDeletable: query.node(currentNodeId).isDeletable(),
      };
    }

    return {
      selected,
      isEnabled: state.options.enabled,
    };
  });

  return isEnabled && selected ? (
    <>
    <div style={{backgroundColor:"#076321"}}>
      <h4 className="ms-2">Edición de componente</h4>
    </div>
    <div className="overflow-auto" style={{maxHeight:"100%"}}>
      <div style={{maxHeight:"100%"}}>
        <div className="ms-2" data-cy="settings-panel">
          {selected.settings && React.createElement(selected.settings)}
        </div>
        {selected.isDeletable ? (
          <div className="d-flex justify-content-end">
            <div className="m-1">
              <button
                className="btn btn-danger"
                onClick={() => {
                  actions.delete(selected.id);
                }}
              >
                <i className="lni lni-trash-can"></i> Eliminar
              </button>
            </div>
          </div>
          ) : null}
      </div>
    </div>
    </>
    
  ) : null;
};
