function fechaAString(fecha){
  return fecha.toISOString().split('T')[0];
}

function stringAFecha(fecha){
  let [anio,mes,dia] = fecha.split("-");
  anio = parseInt(anio);
  mes = parseInt(mes);
  dia = parseInt(dia);
  return new Date(anio, mes-1, dia);
}

function stringBarrasAFecha(fecha){
  let [dia,mes,anio] = fecha.split("/");
  anio = parseInt(anio);
  mes = parseInt(mes);
  dia = parseInt(dia);
  return new Date(anio, mes-1, dia);
}

function fechaAStringSlash(fecha){
  return fecha.getDate()+"/"+(fecha.getMonth()+1)+"/"+fecha.getFullYear();
}

export {
  fechaAString,
  stringAFecha,
  fechaAStringSlash,
  stringBarrasAFecha,
};