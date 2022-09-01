const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('reserva_activo', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inicio: type.DATE,
        final: type.DATE,
    });