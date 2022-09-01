const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('actividad', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: type.STRING,
    territorio: type.STRING,
    domicilio: type.STRING,
    tipo: type.STRING
});