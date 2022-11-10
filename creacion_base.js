const Sequelize = require('sequelize');
const actividad = require("./modelo/actividad");
const inmueble = require("./modelo/inmueble");
const gasto = require("./modelo/gasto");
const organizacion = require("./modelo/organizacion");
const pagina = require("./modelo/pagina");
const proyecto = require("./modelo/proyecto");
const reserva_inmueble = require("./modelo/reserva_inmueble");
const usuario = require("./modelo/usuario");
const sequelize = require('./conexion_base');
const proyecto_x_usuario = require('./modelo/proyecto_x_usuario');
const puesto = require('./modelo/puesto');

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

usuario.hasMany(puesto, {
  foreignKey: 'id_usuario',
  onDelete: 'cascade',
});

puesto.belongsTo(usuario, {
  foreignKey: 'id_usuario'
});

organizacion.hasMany(puesto, {
  foreignKey: 'id_organizacion'
});

puesto.belongsTo(organizacion, {
  foreignKey: 'id_organizacion'
});

proyecto.hasMany(gasto, {
  foreignKey: 'id_proyecto'
});

gasto.belongsTo(proyecto, {
  foreignKey: 'id_proyecto'
});

actividad.belongsToMany(inmueble,{
  through: {
    model:reserva_inmueble,
    unique:false,
  },
  foreignKey: 'id_actividad'
});

inmueble.belongsToMany(actividad,{
  through: {
    model:reserva_inmueble,
    unique:false,
  },
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
  foreignKey: 'id_usuario',
  onDelete: 'cascade',
});

proyecto_x_usuario.belongsTo(usuario, {
  foreignKey: 'id_usuario'
});

sequelize.sync({ alter: true })
.then(() => {
  console.log("Tablas sincronizadas");
})
