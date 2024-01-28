const CODIGO_STATUS_HTTP = {
    OK: 200,
    CREADO: 201,
    ACEPTADO: 202,
    ERROR_USUARIO: 400,
    NO_LOGGEADO: 401,
    NO_AUTORIZADO: 403,
    NO_ENCONTRADO: 404,
    ERROR_SERVER: 500
}

const mapearError = (res, err) => {
    if(err.errorConocido){
        respuestaError(res, err);
    }else{
        algoSalioMal(res, err);
    }
};

const respuestaError = (res, err, mensaje) => {
    res.status(err.status);
    res.send({error:mensaje, info: err.info});
};

const estaUsuarioLoggeado = (req) => {
    if(req.session.idUsuario && req.session.idUsuario != -1){
        return true;
    }
    throw {error:"Debe iniciar sesión", info: err}
}



const algoSalioMal = (res, err) => {
    res.status(CODIGO_STATUS_HTTP.ERROR_SERVER);
    res.send({error:"Algo salió mal", info: err});
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
    estaUsuarioLoggeado
};