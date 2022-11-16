/*
partirStringHora parte un string donde
tenga el caracter :

Entradas:
- hora: string de la forma número_entero:número_entero

Salida: Lista con strings
 */
function partirStringHora(hora){
  return hora.split(":");
}

/*
convertirHoraAMPM convierte un string
con la forma de la hora y le pone am,
pm o md según corresponda, si se quiere
se puede añadir un 0 frente a los números
que son menores de 10

Entradas:
- hora: string con la forma número_entero:número_entero

Salida: string con la hora en formato am/md/pm
 */
function convertirHoraAMPM(hora, con0, conTiempo){
  let [horas,minutos] = Array.isArray(hora) ? hora : hora.split(":");
  let tiempo = "am";
  horas = parseInt(horas);
  minutos = parseInt(minutos);
  if(horas === 12){
    tiempo = "md";
  } else if(horas > 12){
    tiempo = "pm";
    horas = horas-12;
  }
  if(con0){
    if(horas < 10){
      horas = "0"+horas;
    }
    if(minutos < 10){
      minutos = "0"+minutos;
    }
  }
  if(conTiempo)
    return horas+":"+minutos+tiempo;
  return horas+":"+minutos;
}

function horaAFecha(hora){
  let [horas,min] = hora.split(":");
  let fecha = new Date();
  fecha.setUTCHours(horas, min, 0, 0);
  return fecha;
}

function fechaAHoraAMPM(fecha, con0, conTiempo){
  return convertirHoraAMPM([fecha.getUTCHours(), fecha.getUTCMinutes()], con0, conTiempo);
}

export {
  partirStringHora,
  convertirHoraAMPM,
  horaAFecha,
  fechaAHoraAMPM,
}; 