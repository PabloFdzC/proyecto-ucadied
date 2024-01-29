const { inspect } = require('util');

const CODIGO_STATUS_HTTP = {
    OK: 200,
    CREADO: 201,
    ACEPTADO: 202,
    ERROR_USUARIO: 400,
    NO_LOGGEADO: 401,
    NO_AUTORIZADO: 403,
    NO_ENCONTRADO: 404,
    ERROR_SERVER: 500
};

const mapearError = (res, err) => {
    console.log("====================");
    console.log(err);
    console.log("====================");
    if(err.errorConocido){
        respuestaError(res, err);
    }else{
        algoSalioMal(res, err);
    }
};

const respuestaError = (res, err) => {
    res.status(err.status);
    delete err.errorConocido;
    res.json(err);
};

const estaUsuarioLoggeado = (req) => {
    if(req.session.idUsuario && req.session.idUsuario != -1){
        return true;
    }
    throw {error:"Debe iniciar sesión", errorConocido: true}
}



const algoSalioMal = (res, err) => {
    res.status(CODIGO_STATUS_HTTP.ERROR_SERVER);
    res.json({error:"Algo salió mal", info: inspect(myObject, {depth: null})});
}

const creado = (res, obj) => {
    res.status(CODIGO_STATUS_HTTP.CREADO);
    res.json(obj);
};

const salioBien = (res, obj) => {
    res.status(CODIGO_STATUS_HTTP.OK);
    res.json(obj);
}

module.exports = {
    mapearError,
    algoSalioMal,
    creado,
    salioBien,
    estaUsuarioLoggeado,
    CODIGO_STATUS_HTTP
};