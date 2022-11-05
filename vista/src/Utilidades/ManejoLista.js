function buscarEnListaPorId(lista, id){
  return lista.findIndex(valor => {
      return valor.id === id;
      });
}

export {
  buscarEnListaPorId,
};