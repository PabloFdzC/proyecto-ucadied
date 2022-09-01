const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('componente', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING,
        css: type.STRING,
        basico: type.BOOLEAN,
        atributos: type.JSON   
    });