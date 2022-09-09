const type = require('sequelize');
const sequelize = require('../conexion_base');
const organizacion = require('./organizacion');
const persona = require('./persona');

module.exports = sequelize.define('organizacion_x_persona', {
    id_organizacion: {
      type: type.INTEGER,
      references: {
        model: organizacion,
        key: 'id'
      },
      primaryKey: true
    },
    id_persona: {
      type: type.INTEGER,
      references: {
        model: persona,
        key: 'id'
      },
      primaryKey: true
    }
  });