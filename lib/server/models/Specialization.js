import { DataTypes } from 'sequelize';
import sequelize from '../db.js';


const Specialization = sequelize.define('Specialization', {
    specialization_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'Specializations',
    timestamps: true,
});
export default Specialization;