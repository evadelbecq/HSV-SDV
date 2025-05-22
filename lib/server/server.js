import express from 'express';
import sequelize from './db.js';
import router from './api.js';
import cors from 'cors';
import 'dotenv/config';

// Import models to ensure they're loaded before sync
import './models/index.js';

const app = express();
const PORT = process.env.BACKEND_PORT || 3000;

// Middleware
app.use(express.json());

// CORS middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin', 'Access-Control-Allow-Credentials'],
}));

// Routes
app.use('/api', router);

// Connexion à la base et démarrage du serveur
async function start() {
  try {
    // Test the connection first
    await sequelize.authenticate();
    console.log('Connection to database successful');
    
    // await sequelize.sync();
    // console.log('Database synchronized successfully (tables recreated)');
    
    app.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Server startup error:', error);
  }
}

start();