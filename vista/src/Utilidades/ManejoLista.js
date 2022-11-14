function buscarEnListaPorId(lista, id){
  if(id && !isNaN(id)){
    return lista.findIndex(valor => {
      return valor.id === id;
      });
  }
  return -1;
}

export {
  buscarEnListaPorId,
};