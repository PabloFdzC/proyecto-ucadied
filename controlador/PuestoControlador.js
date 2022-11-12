const puesto = require('../modelo/puesto');
const usuario = require('../modelo/usuario');
const queries_generales = require('./QueriesGenerales');

// Función para modificar un puesto.
// Se mandan como parámetros el id
// del puesto y la información a 
// modificar
async function modificar(id, info){
    return await queries_generales.modificar(puesto, {id}, info);
}

// Función para crear un puesto.
// Se manda como parámetro la
// información para crear el puesto.
async function crear(info){
    return await queries_generales.crear(puesto, info);
}

// Función para crear varios puestos.
// Se manda como parámetro la información
// de los puestos que se van a crear.
async function crear_varios(info){
    return await queries_generales.crear_varios(puesto, info);
}

// Función para eliminar un puesto.
// Se envía como parámetro el id
// del puesto que se va a eliminar 
async function eliminar(id){
    return await queries_generales.eliminar(puesto, id);
}

// Función para consultar un conjunto de puestos.
// Se envía como parámetro los filtros de búsqueda.
async function consultar(params){
    return await queries_generales.consultar(puesto, {
        include: [
            {
                model: usuario,
                attributes: ["nombre"]
            }
        ],
        where: params});
}

// Fucnión para consultar los puestos de un usuario.
// Se envía como parámetro el id del usuario.
async function consultar_puestos_usuario(id_usuario){
    return await queries_generales.consultar(puesto, {
        where: {
            id_usuario
        }
    });
}

// Función para consultar si un usuario tiene un permiso en una organización.
// Se envían como parámetros el id del usuario, el id de la organización y 
// el permiso. Si el usuario lo tiene devuelve true, de lo contrario devuelve false
async function consultar_permisos(id_usuario, id_organizacion, permiso){
    const puestos = await consultar_puestos_usuario(id_usuario);
    var puesto = {};
    for(var i = 0; i < puestos.length; i+=1){
        puesto = puestos[i];
        if(puesto[permiso] && puesto.id_organizacion === parseInt(id_organizacion)){
            return true;
        }
    }
    return false;
}

module.exports = {
    consultar_puestos_usuario,
    crear,
    crear_varios,
    modificar,
    eliminar,
    consultar,
    consultar_permisos
}