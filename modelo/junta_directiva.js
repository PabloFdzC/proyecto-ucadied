const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('junta_directiva', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        n_miembros: type.INTEGER,
        forma_elegir: type.STRING
    });