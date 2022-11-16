import {stringAFecha} from './ManejoFechas';
import {partirStringHora} from './ManejoHoras';

class Validacion {
    constructor(reglas, componente){
        this.reglas = reglas;
        this.componente = componente;
    }

    validarCampos(campos){
        var errores = {hayError:false};
        for (let c in this.reglas){
            let reglasDeCampo = this.reglas[c].split("|");
            errores[c] = "";
            if (reglasDeCampo.indexOf("requerido") > -1){
                if(this.validaVacio(campos[c])){
                    errores[c] = "El campo no puede estar vacío."
                    errores.hayError = true;
                    continue;
                }
            }
            if (reglasDeCampo.indexOf("seleccionado") > -1){
                if(typeof campos[c] === 'string' || campos[c] instanceof String){
                    if(this.validaVacio(campos[c])){
                        errores[c] = "Debe seleccionar una opción."
                        errores.hayError = true;
                        continue;
                    }
                } else {
                    if((typeof campos[c]) === 'object' && campos[c]){
                        if(typeof campos[c].value === 'string' || campos[c].value instanceof String){
                            if(this.validaVacio(campos[c].value)){
                                errores[c] = "Debe seleccionar una opción."
                                errores.hayError = true;
                                continue;
                            }
                        } else if(isNaN(campos[c].value)){
                            errores[c] = "Debe seleccionar una opción."
                            errores.hayError = true;
                            continue;
                        }
                    } else if(!campos[c]) {
                        errores[c] = "Debe seleccionar una opción."
                        errores.hayError = true;
                        continue;
                    }
                }
            }
            if (reglasDeCampo.indexOf("tiene-valores") > -1){
                if(!(campos[c].length > 0)){
                    errores[c] = "Se ocupa al menos 1."
                    errores.hayError = true;
                    continue;
                }
            }
            if (reglasDeCampo.indexOf("email") > -1){
                if(!this.validaEmail(campos[c])){
                    errores[c] = "No es un email válido."
                    errores.hayError = true;
                }
            }
            if (reglasDeCampo.indexOf("numeros") > -1){
                if(!this.validaSoloNumeros(campos[c])){
                    errores[c] = "Solo se permiten números."
                    errores.hayError = true;
                }
            }
            if (reglasDeCampo.indexOf("fecha") > -1){
                if(!this.validaFecha(campos[c])){
                    errores[c] = "No es una fecha válida."
                    errores.hayError = true;
                }
            }
            if (reglasDeCampo.indexOf("captcha") > -1){
                if(this.validaVacio(campos[c])){
                    errores[c] = "Debe realizar el captcha."
                    errores.hayError = true;
                }
            }
        }
        var estadoNuevo = this.componente.state.errores;
        for (let e in errores){
            estadoNuevo[e] = errores[e];
        }
        this.componente.setState(estadoNuevo);
    }

    validaVacio(valor){
        return !valor.trim().length;
    }

    validaEmail(valor){
        return valor.match("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?")
    }

    validaSoloNumeros(valor){
        return valor.match(/^[0-9]+$/);
    }

    validaFecha(valor){
        if(valor.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}$/)){
            let [anio,mes,dia] = valor.split("-");
            anio = parseInt(anio);
            mes = parseInt(mes);
            dia = parseInt(dia);
            let fecha = new Date(anio, mes-1, dia);
            return anio === fecha.getFullYear() && mes === fecha.getMonth()+1 && dia === fecha.getDate();
        }
        return false;
    }

    agregarRegla(campo, reglas){
        this.reglas[campo] = reglas;
    }

    eliminarRegla(campo){
        if(this.reglas.hasOwnProperty(campo))
            delete this.reglas[campo];
    }

    horaInicialFinalCorrectas(inicio, final){
        let [horaI,minI] = partirStringHora(inicio);
        let [horaF,minF] = partirStringHora(final);
        horaI = parseInt(horaI);
        minI = parseInt(minI);
        horaF = parseInt(horaF);
        minF = parseInt(minF);
        if((horaI === horaF && minI > minF) || (horaI > horaF)){
            return {
                inicio:"Hora inicio debe empezar antes que la final",
                final:"Hora final debe empezar después que la de inicio",
            };
        } else if(horaI === horaF && minI === minF){
            return {
                inicio:"Hora de inicio no puede ser igual que hora final",
                final: "Hora final no puede ser igual que hora de inicio",
            };
        }
        return {
            inicio:"",
            final:"",
        };
    }
    fechaInicialFinalCorrectas(inicio, final, puedenIguales){
        let fechaInicio = stringAFecha(inicio);
        let fechaFinal = stringAFecha(final);
        if(fechaInicio > fechaFinal){
            return {
                inicio:"Fecha de inicio debe empezar antes que final",
                final:"Fecha final debe empezar después que la de inicio",
            };
        } if(!puedenIguales && fechaInicio == fechaFinal){
            return {
                inicio:"Fecha de inicio debe ser distinta a final",
                final:"Fecha final debe ser distinta a la de inicio",
            };
        }
        return {
            inicio:"",
            final:"",
        };
    }

}

export default Validacion;