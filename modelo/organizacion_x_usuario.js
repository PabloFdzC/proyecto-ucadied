const type = require('sequelize');
const sequelize = require('../conexion_base');
const organizacion = require('./organizacion');
const usuario = require('./usuario');

module.exports = sequelize.define('organizacion_x_usuario', {
    id_organizacion: {
      type: type.INTEGER,
      references: {
        model: organizacion,
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