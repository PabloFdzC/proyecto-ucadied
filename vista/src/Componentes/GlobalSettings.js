import { manejaCambio, unidades } from "./Utilidades/Utilidades";
import { SeleccionColor } from "./Utilidades/SeleccionColor";
import { useState } from 'react';

export const GlobalTextSettings = (props) => {

  return (
    <>
      <div className="mb-3">
            <label htmlFor="text" className="form-label">Texto</label>
            <input
              type="text"
              className="form-control"
              key="text"
              name="text"
               value={props.text}
               onChange={(e) => manejaCambio(props.setProp, "text", e)} />
        </div>
        <div className="mb-3">
            <label htmlFor="colorFondo" className="form-label">Color</label>
            <SeleccionColor
              id="colorFondo"
              name="colorFondo"
              value={props.color}
              onChange={(e) => manejaCambio(props.setProp, "color", e)}
              onChangeComplete={(e) => props.setProp((p) => (p.color = e.hex))} />
        </div>
    </>
  );
};

export const GlobalBackgroundSettings = (props) => {

  return (
    <>
      <div className="mb-3">
        <label htmlFor="opacidad" className="form-label">Opacidad</label>
        <input
          className="form-control"
          type="number"
          name="opacidad"
          value={props.opacity}
          onChange={(e) => {
            props.setProp((p) => (p.opacidad = e.target.value));
          }} min={0} max={100}/>
        <input
          className="form-range"
          type="range"
          name="opacidad"
          value={props.opacity}
          min={0}
          max={100}
          onChange={(e) => {
            props.setProp((p) => (p.opacity = e.target.value), 1000);
          }} />
        
      </div>
      <div className="mb-3">
          <label htmlFor="colorFondo" className="form-label">Color de fondo</label>
          <SeleccionColor
            id="colorFondo"
            name="colorFondo"
            value={props.backgroundColor}
            onChange={(e) => manejaCambio(props.setProp, "backgroundColor", e)}
            onChangeComplete={(e) => props.setProp((p) => (p.backgroundColor = e.hex))} />
      </div>
    </>
  );
};

export const GlobalSpacingSettings = (props) => {
  const posiciones = ["Arriba", "Derecha", "Abajo", "Izquierda"];
  const margins = ["marginTop", "marginRight", "marginBottom", "marginLeft"];
  const paddings = ["paddingTop", "paddingRight", "paddingBottom", "paddingLeft"];
  return (
    <>
      <div className="mb-3">
        <h4>Margen</h4>
        <label htmlFor="unidad" className="form-label">Unidad</label>
        <select
          className="form-select"
          name="unidad"
          value={props.marginUnit}
          onChange={(e) => manejaCambio(props.setProp, "marginUnit", e)} >
            {unidades.map((valor, indice)=><option key={indice} value={valor}>{valor}</option>)}
        </select>
        {margins.map((valor, indice)=>
          <div className="mb-3" key={indice}>
            <label htmlFor={valor} className="form-label">{posiciones[indice]}</label>
            <input
              className="form-control"
              type="number"
              name={valor}
              value={props[valor]}
              onChange={(e) => manejaCambio(props.setProp, valor, e)} />
          </div>
        )}
      </div>

      <div className="mb-3">
        <h4>Relleno</h4>
        <label htmlFor="unidad" className="form-label">Unidad</label>
        <select
          className="form-select"
          name="unidad"
          value={props.paddingUnit}
          onChange={(e) => manejaCambio(props.setProp, "paddingUnit", e)} >
            {unidades.map((valor, indice)=><option key={indice} value={valor}>{valor}</option>)}
        </select>
        {paddings.map((valor, indice)=>
          <div className="mb-3" key={indice}>
            <label htmlFor={valor} className="form-label">{posiciones[indice]}</label>
            <input
              className="form-control"
              type="number"
              name={valor}
              value={props[valor]}
              onChange={(e) => manejaCambio(props.setProp, valor, e)} />
          </div>
        )}
      </div>
      
    </>
  );
};

export const GlobalURLSettings = (props) => {

  return (
    <>
      <div className="mb-3">
            <label htmlFor="url" className="form-label">URL</label>
            <input
              type="text"
              className="form-control"
              key="url"
              name="url"
              value={props.src}
              onChange={(e) => manejaCambio(props.setProp, "src", e)} />
        </div>
    </>
  );
};

export const GlobalDimensionsSettings = (props) => {
  const dimensionsVals = ["auto", "fit-content", "inherit", "initial", "max-content", "min-content", "revert", "revert-layer", "unset"];
  const dimensionsValsES = ["Automático", "Ajustar contenido", "Heredada", "Inicial", "Max-contenido", "Min-contenido", "Revertir", "Revertir-capa", "Sin colocar"];
  return (
    <>
    <h5>{props.name}</h5>
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        checked={props.custom === "true" || props.custom === true}
        onChange={(e)=>manejaCambio(props.setProp, props.customName, e)}
        id="custom" />
      <label className="form-check-label" htmlFor="custom">
        Personalizado
      </label>
    </div>
    {props.custom ?
      <>
      <div className="mb-3">
        <label htmlFor={props.unitName} className="form-label">Unidad</label>
        <select
          className="form-select"
          name={props.unitName}
          id={props.unitName}
          value={props.unit}
          onChange={(e) => manejaCambio(props.setProp, props.unitName, e)} >
            {unidades.map((valor, indice)=><option key={indice} value={valor}>{valor}</option>)}
        </select>
      </div>
      <div className="mb-3">
          <label htmlFor={props.id} className="form-label">{props.name}</label>
          <input
            type="number"
            className="form-control"
            name={props.id}
            id={props.id}
            value={props.value}
            onChange={(e) => manejaCambio(props.setProp, props.id, e)} />  
      </div>
      </>
    :
      <div className="mb-3">
        <label htmlFor={props.id} className="form-label">{props.name}</label>
        <select
          className="form-select"
          name={props.id}
          id={props.id}
          value={props.value}
          onChange={(e) => manejaCambio(props.setProp, props.id, e)} >
            {dimensionsValsES.map((valor, indice)=><option key={indice} value={dimensionsVals[indice]}>{valor}</option>)}
        </select>
      </div>}
    </>
  );
};