const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('gasto', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING,
        monto: type.DOUBLE,
        fecha: type.DATEONLY,
        numero_acta: type.INTEGER,
        numero_acuerdo: type.INTEGER
    });