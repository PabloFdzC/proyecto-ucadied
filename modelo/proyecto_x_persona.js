const type = require('sequelize');
const sequelize = require('../conexion_base');
const proyecto = require('./proyecto');
const persona = require('./persona');

module.exports = sequelize.define('proyecto_x_persona', {
    id_proyecto: {
      type: type.INTEGER,
      references: {
        model: proyecto,
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