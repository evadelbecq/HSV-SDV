import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Doctor = sequelize.define('Doctor', {
    doctor_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users',
            key: 'user_id'
        }
    },
    specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
            model: 'Specializations',
            key: 'specialization_id'
        }
    }
}, {
    tableName: 'Doctors',
    timestamps: true,
});

export default Doctor;