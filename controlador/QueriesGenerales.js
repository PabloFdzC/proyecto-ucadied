// Función para consultar algún modelo, se debe
// mandar el modelo como parámetro y los filtros
// para la consulta
async function consultar(modelo, filtros){
    return await modelo.findAll(filtros);
}

// Función para crear una instancia de 
// algún modelo, se debe mandar el modelo 
// como parámetro y la información para 
// crear la instancia
async function crear(modelo, info){
    const objeto_creado = await modelo.create(info);
    return objeto_creado;
}

// Función para crear varias instancias de 
// algún modelo, se debe mandar el modelo 
// como parámetro y la información para 
// crear las instancias
async function crear_varios(modelo, info){
    const objeto_creado = await modelo.bulkCreate(info);
    return objeto_creado;
}

// Función para modificar una instancia de 
// algún modelo, se debe mandar el modelo 
// como parámetro, los filtros de la instancia 
// y la información que se debe modificar de 
// la instancia
async function modificar(modelo, filtros, info){
    await modelo.update(info, {
        where: filtros
    });
    return {success: "Objeto modificado"};
}

// Función para eliminar una instancia de algún 
// modelo, se debe mandar el modelo como parámetro 
// y los filtros de la instancia.
async function eliminar(modelo, filtros){
    await modelo.destroy({
        where: filtros
    });
    return {success: "Objeto eliminado"};
}

module.exports = {
    consultar,
    crear,
    crear_varios,
    modificar,
    eliminar
}