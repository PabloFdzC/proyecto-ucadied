const express = require('express');
const app = express();
const Sequelize = require('sequelize');
var nombreBase = 'proyectoucadied';
var usuario = 'root';
var clave = '1234';
var info = {
    host: 'localhost',
    dialect: 'mysql'
};

if (app.get('env') === 'production') {
    usuario = process.env.USUARIO;
    clave = process.env.CLAVE;
    info.host = process.env.HOST;
    nombreBase = process.env.NOMBRE_BASE;
}


const sequelize = new Sequelize(nombreBase, usuario, clave, info);

module.exports = sequelize;
