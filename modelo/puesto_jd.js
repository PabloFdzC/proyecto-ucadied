const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('puesto_jd', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING,
        funcion: type.STRING,
        edita_pagina: type.BOOLEAN
    });