const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('inmueble', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: type.STRING,
    horario: type.JSON,
});