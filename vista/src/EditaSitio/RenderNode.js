/**
 * Este código fue en su mayoría tomado de: 
 * https://codesandbox.io/s/9lmx8?file=/components/editor/RenderNode.tsx
 * que es el ejemplo avanzado de usar la biblioteca craft.js
 * se le hicieron pequeñas modificaciones para que se ajustaran al proyecto
 */

import { useNode, useEditor } from '@craftjs/core';
import { ROOT_NODE } from '@craftjs/utils';
import React, { useEffect, useRef, useCallback } from 'react';
import ReactDOM from 'react-dom';

import '../Estilos/Editor.css';

export const RenderNode = ({ render }) => {
  const { id } = useNode();
  const { actions, query, isActive } = useEditor((_, query) => ({
    isActive: query.getEvent('selected').contains(id),
  }));

  const {
    isHover,
    dom,
    name,
    moveable,
    deletable,
    connectors: { drag },
    parent,
  } = useNode((node) => ({
    isHover: node.events.hovered,
    dom: node.dom,
    name: node.data.custom.displayName || node.data.displayName,
    moveable: query.node(node.id).isDraggable(),
    deletable: query.node(node.id).isDeletable(),
    parent: node.data.parent,
    props: node.data.props,
  }));

  const currentRef = useRef();

  useEffect(() => {
    if (dom) {
      if (isActive || isHover) dom.classList.add('component-selected');
      else dom.classList.remove('component-selected');
    }
  }, [dom, isActive, isHover]);

  const getPos = useCallback((dom) => {
    const { top, left, bottom } = dom
      ? dom.getBoundingClientRect()
      : { top: 0, left: 0, bottom: 0 };
    return {
      top: `${top > 0 ? top : bottom}px`,
      left: `${left}px`,
    };
  }, []);

  return (
    <>
      {isHover || isActive
        ? ReactDOM.createPortal(
            <div
              ref={currentRef}
              className="indicator-div px-2 py-2 d-flex bg-primary"
              style={{
                left: getPos(dom).left,
                top: getPos(dom).top,
                zIndex: 9999,
              }}
              onClick={() => {
                actions.selectNode(id);
              }}
            >
              <h2 className="me-2 indicator-h2">{name}</h2>
              {moveable ? (
                <button className="btn btn-renderNode me-2 cursor-move" ref={drag}>
                  <i className="lni lni-move"></i>
                </button>
              ) : null}
              {id !== ROOT_NODE && (
                <button
                  className="btn btn-renderNode me-2 cursor-pointer"
                  onClick={() => {
                    actions.selectNode(parent);
                  }}
                >
                  <i className="bi bi-arrow-up-square"></i>
                </button>
              )}
              {deletable ? (
                <button
                  className="btn btn-renderNode cursor-pointer"
                  onMouseDown={(e) => {
                    e.stopPropagation();
                    actions.delete(id);
                  }}
                >
                  <i className="lni lni-trash-can"></i>
                </button>
              ) : null}
            </div>,
            document.querySelector('.page-container')
          )
        : null}
      {render}
    </>
  );
};
