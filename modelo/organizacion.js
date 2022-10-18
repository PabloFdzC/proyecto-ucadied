const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('organizacion', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        cedula: type.STRING,
        nombre: type.STRING,
        domicilio: type.STRING,
        territorio: type.STRING,
        telefonos: type.JSON,
        email: type.STRING,
        forma_elegir_jd: type.STRING,
    },
    {indexes:[{unique:true, fields: ['email']}]});

