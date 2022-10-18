const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('actividad', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: type.STRING,
    tipo: type.ENUM('Privada', 'Pública'),
    coordinador: type.STRING,
    email: type.STRING,
    telefonos: type.JSON
});