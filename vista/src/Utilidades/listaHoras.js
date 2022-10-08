function listaHoras(){
  var horas = [];
  for(let i = 0; i <= 23; i++) { 
    for(let j = 0; j < 59; j+=5) { 
      let hora = i;
      let minuto = j;
      let momento = "am";
      if(i > 12) {
        hora = hora - 12;
        momento = "pm";
      } else if(i === 12){
        momento = "md";
      }
      if(hora < 10){
        hora = "0"+hora;
      }
      if(minuto < 10){
        minuto = "0"+minuto
      }
      horas.push({
        label:hora+":"+minuto+momento,
        value:i+":"+j
      });
    }
  } 
  return horas;
}

export default listaHoras;