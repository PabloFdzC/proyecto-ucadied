/**
 * Este código fue en su mayoría tomado de: 
 * https://codesandbox.io/s/9lmx8?file=/components/editor/Viewport/index.tsx
 * que es el ejemplo avanzado de usar la biblioteca craft.js
 * se le hicieron pequeñas modificaciones para que se ajustaran al proyecto
 */

import { useEditor } from '@craftjs/core';
import React, { useEffect } from 'react';

import '../Estilos/Editor.css';

export const Viewport = ({ children }) => {
  const {
    enabled,
    connectors,
    actions: { setOptions },
  } = useEditor((state) => ({
    enabled: state.options.enabled,
  }));

  useEffect(() => {
    if (!window) {
      return;
    }

    window.requestAnimationFrame(() => {
      window.parent.postMessage(
        {
          LANDING_PAGE_LOADED: true,
        },
        '*'
      );

      setTimeout(() => {
        setOptions((options) => {
          options.enabled = true;
        });
      }, 200);
    });
  }, [setOptions]);

  return (
    <div className="viewport">
      <div className="d-flex h-100 overflow-hidden flex-row w-100">
        <div className="page-container d-flex flex-1 h-100 flex-column">
          <div
          className="craftjs-renderer flex-1 h-100 w-100 transition overflow-auto"
            ref={(ref) => connectors.select(connectors.hover(ref, null), null)}
          >
            <div className="position-relative flex-column d-flex align-items-center">
              {children}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};
