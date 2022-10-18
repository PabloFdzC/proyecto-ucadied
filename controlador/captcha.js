const fetch = require("isomorphic-fetch");

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
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.API_CAPTCHA}&response=${llave}`;
  try{
    var resp = await fetch(url, {
      method: "post",
    });
    resp = await resp.json();
    if(resp.success === true){
      return {exito:"Se hizo el captcha correctamente"};
    } else {
      return {error:"No se hizo el captcha"};
    }
  } catch(err){
    return {error:err};
  }
}

module.exports = {
  verificarCaptcha
}