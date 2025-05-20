import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Reason = sequelize.define('Reason', {
    reason_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    specialization_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Specializations', // Nom de la table référencée
            key: 'specialization_id'  // Clé primaire de la table référencée
        }
    },
    label: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    tableName: 'Reasons',
    timestamps: true,
});

export default Reason;
