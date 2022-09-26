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
                    if(typeof campos[c].value === 'string' || campos[c].value instanceof String){
                        if(this.validaVacio(campos[c].value)){
                            errores[c] = "Debe seleccionar una opción."
                            errores.hayError = true;
                            continue;
                        }
                    } else if(!this.validaSoloNumeros(campos[c].value)){
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

    agregarRegla(campo, reglas){
        this.reglas[campo] = reglas;
    }

    eliminarRegla(campo){
        if(this.reglas.hasOwnProperty(campo))
            delete this.reglas[campo];
    }
}

export default Validacion;