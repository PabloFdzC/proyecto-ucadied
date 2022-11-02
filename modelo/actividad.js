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
    persona_contacto: type.STRING,
    email: type.STRING,
    identificacion: type.STRING,
    telefonos: type.JSON
});