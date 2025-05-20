import { DataTypes } from 'sequelize';
import sequelize from '../db.js';

const Appointment = sequelize.define('Appointment', {
  appointment_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  patient_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Patients',
      key: 'patient_id'
    }
  },
  doctor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Doctors',
      key: 'doctor_id'
    }
  },
  reason_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Reasons',
      key: 'reason_id'
    }
  }
}, {
  tableName: 'Appointments',
  timestamps: true
});

export default Appointment;