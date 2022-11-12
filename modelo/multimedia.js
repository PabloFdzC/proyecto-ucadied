const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('multimedia', {
    id: {
        type: type.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    url: type.STRING,
    tipo: type.ENUM('Imagen', 'Video')
});