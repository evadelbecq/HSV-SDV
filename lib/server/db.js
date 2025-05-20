import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('HSV', 'root', '', {
  host: 'localhost',
  dialect: 'mysql', // ou 'postgres', 'sqlite', 'mssql'
  logging: false,   // Désactiver les logs SQL dans la console
});

export default sequelize;