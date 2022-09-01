const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('proyecto', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inicio: type.DATE,
        cierre: type.DATE,
        nombre: type.STRING,
        presupuesto: type.DOUBLE,
    });