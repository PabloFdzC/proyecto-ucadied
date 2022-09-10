
async function consultar(modelo, filtros){
    const resultados = await modelo.findAll(filtros);
    return resultados;
}

async function crear(modelo, info){
    const objeto_creado = await modelo.create(info);
    return objeto_creado;
}

async function modificar(modelo, id, info){
    await modelo.update(info, {
        where: {id: id}
    });
    return {success: "Objeto modificado"};
}

async function eliminar(modelo, filtros){
    await modelo.destroy({
        where: filtros
    });
    return {success: "Objeto eliminado"};
}

module.exports = {
    consultar,
    crear,
    modificar,
    eliminar
}