const type = require('sequelize');
const sequelize = require('../conexion_base');

module.exports = sequelize.define('usuario', {
        id: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        email: type.STRING,
        contrasenna: type.STRING,
        tipo: type.ENUM('Administrador', 'Usuario'),
        activo: {
            type:type.BOOLEAN,
            defaultValue: '1'
        },
        fecha_nacimiento: {
            type: type.DATEONLY,
            get() {
                const rawValue = this.getDataValue('fecha_nacimiento');
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
        profesion: type.STRING,
        nombre: type.STRING,
        identificacion: type.STRING,
        telefonos: type.JSON,
    },
    {indexes:[{unique:true, fields: ['email', 'identificacion']}]});
