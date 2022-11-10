export const manejaCambio = (props, valor, evento) => {
  props.setProp((p) => (p[valor] = evento.target.value));
};

export const unidades = [
  "cm",
  "mm",
  "in",
  "px",
  "pt",
  "pc",
  "em",
  "ex",
  "ch",
  "rem",
  "vw",
  "vh",
  "vmin",
  "vmax",
  "%"];