const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('reserva_inmueble', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inicio: {
            type: type.DATE,
            get() {
                const rawValue = this.getDataValue('inicio');
                const inputDate = new Date(rawValue);
                return inputDate.toUTCString();
            }
        },
        final:{
            type: type.DATE,
            get() {
                const rawValue = this.getDataValue('final');
                const inputDate = new Date(rawValue);
                return inputDate.toUTCString();
            }
        },
        habilitado: {
            type: type.BOOLEAN,
            defaultValue: '0'
        }
    });