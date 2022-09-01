const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('activo', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING,
        disponible: type.BOOLEAN
    });