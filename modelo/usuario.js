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
        },
        contrasenna: type.STRING,
        tipo: type.ENUM('Administrador', 'Usuario'),
        activo: {
            type:type.BOOLEAN,
            defaultValue: true
        },
        fecha_nacimiento: type.DATE,
        profesion: type.STRING,
        nombre: type.STRING,
        sexo: type.ENUM('Masculino', 'Femenino', 'No Especificado'),
        nacionalidad: type.STRING,
        telefonos: type.JSON,
    },
    {indexes:[{unique:true, fields: ['email']}]});
