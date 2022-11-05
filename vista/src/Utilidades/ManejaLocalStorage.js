function guardarLocalStorage(llave, valor){
  localStorage.setItem(llave, JSON.stringify(valor));
}

function obtenerLocalStorage(llave){
  return JSON.parse(localStorage.getItem(llave));
}

export {
  guardarLocalStorage,
  obtenerLocalStorage,
}