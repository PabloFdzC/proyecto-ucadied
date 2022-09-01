const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('persona', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fecha_nacimiento: type.DATE,
        profesion: type.STRING,
        nombre: type.STRING,
        sexo: type.ENUM('Masculino', 'Femenino', 'No Especificado'),
        nacionalidad: type.STRING,
        telefonos: type.JSON
    });