import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Patient = sequelize.define('Patient', {
    patient_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Users', // Nom de la table référencée
            key: 'user_id'  // Clé primaire de la table référencée
        }
    }
}, {
    tableName: 'Patients',
    timestamps: true
});


export default Patient;