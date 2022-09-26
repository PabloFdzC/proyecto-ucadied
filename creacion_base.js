const Sequelize = require('sequelize');
const actividad = require("./modelo/actividad");
const activo = require("./modelo/activo");
const componente = require("./modelo/componente");
const gasto = require("./modelo/gasto");
const junta_directiva = require("./modelo/junta_directiva");
const organizacion = require("./modelo/organizacion");
const pagina = require("./modelo/pagina");
const proyecto = require("./modelo/proyecto");
const puesto_jd = require("./modelo/puesto_jd");
const reserva_activo = require("./modelo/reserva_activo");
const usuario = require("./modelo/usuario");
const sequelize = require('./conexion_base');
const proyecto_x_usuario = require('./modelo/proyecto_x_usuario');
const puesto_x_usuario = require('./modelo/puesto_x_usuario');

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
  foreignKey: {
    name:'id_organizacion',
    allowNull: true
  }
});

organizacion.belongsTo(organizacion, {
  foreignKey: {
    name:'id_organizacion',
    allowNull: true
  }
});

puesto_jd.hasMany(puesto_x_usuario, {
  foreignKey: 'id_puesto_jd'
});

puesto_x_usuario.belongsTo(puesto_jd, {
  foreignKey: 'id_puesto_jd'
});

usuario.hasMany(puesto_x_usuario, {
  foreignKey: 'id_usuario'
});

puesto_x_usuario.belongsTo(usuario, {
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

proyecto.belongsToMany(usuario, {
  through: proyecto_x_usuario,
  foreignKey: 'id_usuario'
});

usuario.belongsToMany(proyecto, {
  through: proyecto_x_usuario,
  foreignKey: 'id_proyecto'
});

organizacion.hasMany(usuario, {
  foreignKey: {
    name:'id_organizacion',
    allowNull: true
  }
});

usuario.belongsTo(organizacion, {
  foreignKey: {
    name:'id_organizacion',
    allowNull: true
  }
});

proyecto.hasMany(proyecto_x_usuario, {
  foreignKey: 'id_proyecto'
});

proyecto_x_usuario.belongsTo(proyecto, {
  foreignKey: 'id_proyecto'
});

usuario.hasMany(proyecto_x_usuario, {
  foreignKey: 'id_usuario'
});

proyecto_x_usuario.belongsTo(usuario, {
  foreignKey: 'id_usuario'
});

sequelize.sync({ alter: true })
.then(() => {
  console.log("Tablas sincronizadas");
})
