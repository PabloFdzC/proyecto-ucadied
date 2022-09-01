const Sequelize = require('sequelize');
const actividad = require("./modelo/actividad");
const activo = require("./modelo/activo");
const componente = require("./modelo/componente");
const gasto = require("./modelo/gasto");
const junta_directiva = require("./modelo/junta_directiva");
const organizacion = require("./modelo/organizacion");
const pagina = require("./modelo/pagina");
const persona = require("./modelo/persona");
const proyecto = require("./modelo/proyecto");
const puesto_jd = require("./modelo/puesto_jd");
const reserva_activo = require("./modelo/reserva_activo");
const usuario = require("./modelo/usuario");
const sequelize = require('./conexion_base');
const organizacion_x_usuario = require('./modelo/organizacion_x_usuario');

organizacion.hasOne(junta_directiva, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(activo, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(pagina, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(proyecto, {
  foreignKey: 'id_organizacion'
});

organizacion.hasOne(organizacion, {
  foreignKey: 'id_organizacion'
});

persona.hasOne(usuario, {
  foreignKey: 'id_persona'
});

usuario.hasMany(actividad, {
  foreignKey: 'id_usuario'
});

usuario.hasOne(puesto_jd, {
  foreignKey: 'id_usuario'
});

junta_directiva.hasMany(puesto_jd, {
  foreignKey: 'id_junta_directiva'
});

pagina.hasMany(componente, {
  foreignKey: 'id_pagina'
});

componente.hasOne(componente, {
  foreignKey: 'id_componente'
});

proyecto.hasMany(gasto, {
  foreignKey: 'id_proyecto'
});

actividad.hasMany(reserva_activo, {
  foreignKey: 'id_actividad'
});

activo.hasMany(reserva_activo, {
  foreignKey: 'id_actividad'
});

sequelize.sync({force: false})
.then(() => {
  console.log("Tablas sincronizadas");
})
