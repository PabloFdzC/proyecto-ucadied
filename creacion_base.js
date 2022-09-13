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
const proyecto_x_persona = require('./modelo/proyecto_x_persona');

organizacion.hasOne(junta_directiva, {
  foreignKey: 'id_organizacion'
});

junta_directiva.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(activo, {
  foreignKey: 'id_organizacion'
});

activo.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(pagina, {
  foreignKey: 'id_organizacion'
});

pagina.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(proyecto, {
  foreignKey: 'id_organizacion'
});

proyecto.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

organizacion.hasOne(organizacion, {
  foreignKey: 'id_organizacion'
});

organizacion.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

persona.hasOne(usuario, {
  foreignKey: 'id_persona'
});

usuario.belongsTo(persona, {
  foreignKey: 'id_persona'
});

usuario.hasMany(actividad, {
  foreignKey: 'id_usuario'
});

actividad.belongsTo(usuario, {
  foreignKey: 'id_usuario'
});

usuario.hasMany(puesto_jd, {
  foreignKey: 'id_usuario'
});

puesto_jd.belongsTo(usuario, {
  foreignKey: 'id_usuario'
});

junta_directiva.hasMany(puesto_jd, {
  foreignKey: 'id_junta_directiva'
});

puesto_jd.belongsTo(junta_directiva, {
  foreignKey: 'id_junta_directiva'
});

pagina.hasMany(componente, {
  foreignKey: 'id_pagina'
});

componente.belongsTo(pagina, {
  foreignKey: 'id_pagina'
});

componente.hasOne(componente, {
  foreignKey: 'id_componente'
});

componente.belongsTo(componente, {
  foreignKey: 'id_componente'
});

proyecto.hasMany(gasto, {
  foreignKey: 'id_proyecto'
});

gasto.belongsTo(proyecto, {
  foreignKey: 'id_proyecto'
});

actividad.hasMany(reserva_activo, {
  foreignKey: 'id_actividad'
});

reserva_activo.belongsTo(actividad, {
  foreignKey: 'id_actividad'
});

activo.hasMany(reserva_activo, {
  foreignKey: 'id_activo'
});

reserva_activo.belongsTo(activo, {
  foreignKey: 'id_activo'
});

proyecto.belongsToMany(persona, {
  through: proyecto_x_persona,
  foreignKey: 'id_persona'
});

persona.belongsToMany(proyecto, {
  through: proyecto_x_persona,
  foreignKey: 'id_proyecto'
});

organizacion.hasMany(persona, {
  foreignKey: 'id_organizacion'
});

persona.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

proyecto.hasMany(proyecto_x_persona, {
  foreignKey: 'id_proyecto'
});

proyecto_x_persona.belongsTo(proyecto, {
  foreignKey: 'id_proyecto'
});

persona.hasMany(proyecto_x_persona, {
  foreignKey: 'id_persona'
});

proyecto_x_persona.belongsTo(persona, {
  foreignKey: 'id_persona'
});

sequelize.sync({force: false})
.then(() => {
  console.log("Tablas sincronizadas");
})
