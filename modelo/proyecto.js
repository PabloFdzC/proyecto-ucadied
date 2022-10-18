const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('proyecto', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        inicio: {
            type: type.DATEONLY,
            get() {
                const rawValue = this.getDataValue('inicio');
                const inputDate = new Date(rawValue);
                var date = inputDate.getUTCDate();
                var month = inputDate.getUTCMonth() + 1;
                var year = inputDate.getUTCFullYear();
                if (date < 10) {
                    date = '0' + date;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                return `${date}/${month}/${year}`;
            }
        },
        cierre: {
            type: type.DATEONLY,
            get() {
                const rawValue = this.getDataValue('cierre');
                const inputDate = new Date(rawValue);
                var date = inputDate.getUTCDate();
                var month = inputDate.getUTCMonth() + 1;
                var year = inputDate.getUTCFullYear();
                if (date < 10) {
                    date = '0' + date;
                }
                if (month < 10) {
                    month = '0' + month;
                }
                return `${date}/${month}/${year}`;
            }
        },
        nombre: type.STRING,
        presupuesto: type.DOUBLE,
    });