import { manejaCambio, unidades } from "./Utilidades";
import { SeleccionColor } from "./SeleccionColor";

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
               onChange={(e) => manejaCambio(props, "text", e)} />
        </div>
        <div className="mb-3">
            <label htmlFor="colorFondo" className="form-label">Color</label>
            <SeleccionColor
              id="colorFondo"
              name="colorFondo"
              value={props.color}
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
        <div className="row">
          <div className="col-4">
            <input
              className="form-control"
              type="number"
              name="opacidad"
              value={props.opacity}
              onChange={(e) => {
                props.setProp((p) => (p.opacidad = e.target.value));
              }} min={0} max={100}/>
          </div>
          <div className="col-8">
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
        </div>
        
      </div>
      <div className="mb-3">
          <label htmlFor="colorFondo" className="form-label">Color de fondo</label>
          <SeleccionColor
            id="colorFondo"
            name="colorFondo"
            value={props.backgroundColor}
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
          onChange={(e) => manejaCambio(props, "marginUnit", e)} >
            {unidades.map((valor, indice)=><option key={indice} value={valor}>{valor}</option>)}
        </select>
        <div className="row">
          {margins.map((valor, indice)=>
            <div className="col-3" key={indice}>
              <label htmlFor={valor} className="form-label">{posiciones[indice]}</label>
              <input
                className="form-control"
                type="number"
                name={valor}
                value={props[valor]}
                onChange={(e) => manejaCambio(props, valor, e)} />
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <h4>Relleno</h4>
        <label htmlFor="unidad" className="form-label">Unidad</label>
        <select
          className="form-select"
          name="unidad"
          value={props.paddingUnit}
          onChange={(e) => manejaCambio(props, "paddingUnit", e)} >
            {unidades.map((valor, indice)=><option key={indice} value={valor}>{valor}</option>)}
        </select>
        <div className="row">
          {paddings.map((valor, indice)=>
            <div className="col-3" key={indice}>
              <label htmlFor={valor} className="form-label">{posiciones[indice]}</label>
              <input
                className="form-control"
                type="number"
                name={valor}
                value={props[valor]}
                onChange={(e) => manejaCambio(props, valor, e)} />
            </div>
          )}
        </div>
      </div>
      
    </>
  );
};