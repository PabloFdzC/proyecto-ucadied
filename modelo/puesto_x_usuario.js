const type = require('sequelize');
const sequelize = require('../conexion_base');
const puesto_jd = require('./puesto_jd');
const usuario = require('./usuario');

module.exports = sequelize.define('puesto_x_usuario', {
    id_puesto_jd: {
      type: type.INTEGER,
      references: {
        model: puesto_jd,
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