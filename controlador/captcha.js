const fetch = require("isomorphic-fetch");
const {CODIGO_STATUS_HTTP} = require('./respuestas');

// Una vez se hace el captcha en la interfaz de usuario
// es necesario verificar que de verdad se haya hecho
// para eso es esta función, se le pasa el valor que
// tenga "g-recaptcha-response" (la respuesta del captcha
// que se manda desde la interfaz) como parámetro
// y aquí se valida que sea correcto. Se devuelve un
// objeto con el atributo exito para saber que está
// bien y sino se manda un objeto con el atributo
// error
async function verificarCaptcha(llave){
  let apiCaptcha = process.env.API_CAPTCHA;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${apiCaptcha}&response=${llave}`;
  
  let resp = await fetch(url, {
    method: "post",
  });
  resp = await resp.json();
  
  if(resp.success === true){
    return {exito:"Se hizo el captcha correctamente", status:CODIGO_STATUS_HTTP.OK};
  } else {
    throw {error:"No se hizo el captcha", status: CODIGO_STATUS_HTTP.ERROR_USUARIO, errorConocido:true};
  }
}

module.exports = {
  verificarCaptcha
}