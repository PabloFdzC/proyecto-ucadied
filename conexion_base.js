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
    usuario = 'admin';
    clave = 'Pr0y3ct0Ucadied!';
    info.host = '10.0.1.236';
}

const sequelize = new Sequelize(nombreBase, usuario, clave, info);

module.exports = sequelize;