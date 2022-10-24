const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('puesto_jd', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING,
        edita_pagina: type.BOOLEAN,
        edita_junta: type.BOOLEAN,
        edita_proyecto: type.BOOLEAN,
        edita_actividad: type.BOOLEAN,
    });