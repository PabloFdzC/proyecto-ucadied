const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('gasto', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: type.STRING,
        monto: type.DOUBLE,
        fecha: {
            type: type.DATEONLY,
            get() {
                const rawValue = this.getDataValue('fecha');
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
        numero_acta: type.INTEGER,
        numero_acuerdo: type.INTEGER
    });