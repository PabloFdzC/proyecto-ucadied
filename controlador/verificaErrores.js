const { CODIGO_STATUS_HTTP } = require('./respuestas');

const verificarEncontrado = (listaResultados, error) => {
    if(listaResultados.length === 0){
        throw {
            errorConocido: true,
            status: CODIGO_STATUS_HTTP.NO_ENCONTRADO,
            error
        }
    }
}

module.exports = {
    verificarEncontrado
}