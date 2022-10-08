const Sequelize = require('sequelize');
const actividad = require("./modelo/actividad");
const inmueble = require("./modelo/inmueble");
const componente = require("./modelo/componente");
const gasto = require("./modelo/gasto");
const organizacion = require("./modelo/organizacion");
const pagina = require("./modelo/pagina");
const proyecto = require("./modelo/proyecto");
const puesto_jd = require("./modelo/puesto_jd");
const reserva_inmueble = require("./modelo/reserva_inmueble");
const usuario = require("./modelo/usuario");
const sequelize = require('./conexion_base');
const proyecto_x_usuario = require('./modelo/proyecto_x_usuario');
const puesto_x_usuario = require('./modelo/puesto_x_usuario');

organizacion.hasMany(inmueble, {
  foreignKey: 'id_organizacion'
});

inmueble.belongsTo(organizacion, {
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

organizacion.hasMany(puesto_x_usuario, {
  foreignKey: 'id_organizacion'
});

puesto_x_usuario.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

organizacion.hasMany(puesto_jd, {
  foreignKey: 'id_organizacion'
});

puesto_jd.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
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

actividad.belongsToMany(inmueble,{
  through: reserva_inmueble,
  foreignKey: 'id_actividad'
});

inmueble.belongsToMany(actividad,{
  through: reserva_inmueble,
  foreignKey: 'id_inmueble'
});

actividad.hasMany(reserva_inmueble, {
  foreignKey: 'id_actividad'
});

reserva_inmueble.belongsTo(actividad, {
  foreignKey: 'id_actividad'
});

inmueble.hasMany(reserva_inmueble, {
  foreignKey: 'id_inmueble'
});

reserva_inmueble.belongsTo(inmueble, {
  foreignKey: 'id_inmueble'
});

proyecto.belongsToMany(usuario, {
  through: proyecto_x_usuario,
  foreignKey: 'id_proyecto'
});

usuario.belongsToMany(proyecto, {
  through: proyecto_x_usuario,
  foreignKey: 'id_usuario'
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
