const type = require('sequelize');
const sequelize = require('../conexion_base');
const proyecto = require('./proyecto');
const usuario = require('./usuario');

module.exports = sequelize.define('proyecto_x_usuario', {
    id_proyecto: {
      type: type.INTEGER,
      references: {
        model: proyecto,
        key: 'id'
      },
      primaryKey: true
    },
    id_usuario: {
      type: type.INTEGER,
      references: {
        model: usuario,
        key: 'id'
      },
      primaryKey: true
    }
  });