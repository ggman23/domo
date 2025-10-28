import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import tuyaRoutes from './routes/tuya.js';
import { startDeviceMonitoring } from './services/deviceMonitor.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tuya', tuyaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur de domotique actif' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  console.log(`📡 API disponible sur http://localhost:${PORT}/api`);

  // Démarrer la surveillance des appareils toutes les 30 secondes
  startDeviceMonitoring();
});

export default app;
