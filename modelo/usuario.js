const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('usuario', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: type.STRING,
        contrasenna: type.STRING,
        tipo: type.ENUM('Administrador', 'Usuario'),
        activo: {
            type:type.BOOLEAN,
            defaultValue: '1'
        },
        fecha_nacimiento: type.DATEONLY,
        profesion: type.STRING,
        nombre: type.STRING,
        sexo: type.ENUM('Masculino', 'Femenino', 'No Especificado'),
        nacionalidad: type.STRING,
        telefonos: type.JSON,
    },
    {indexes:[{unique:true, fields: ['email']}]});
