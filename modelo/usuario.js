const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('usuario', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: {
            type: type.STRING,
            unique: true
        },
        contrasenna: type.STRING,
        tipo: type.ENUM('Administrador', 'Usuario'),
        activo: type.BOOLEAN
    });
