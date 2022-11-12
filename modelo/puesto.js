const type = require('sequelize');
const sequelize = require('../conexion_base');
const organizacion = require('./organizacion');
const usuario = require('./usuario');

module.exports = sequelize.define('puesto', {
    id: {
      type: type.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    edita_pagina: type.BOOLEAN,
    edita_junta: type.BOOLEAN,
    edita_proyecto: type.BOOLEAN,
    edita_actividad: type.BOOLEAN,
    edita_inmueble: type.BOOLEAN,
    nombre: type.STRING
  });