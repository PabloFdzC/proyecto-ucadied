export const manejaCambio = (setProp, nombreProp, evento) => {
  const objetivo = evento.target;
  const valor = objetivo.type === 'checkbox' ? objetivo.checked : objetivo.value;
  setProp((p) => (p[nombreProp] = valor));
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