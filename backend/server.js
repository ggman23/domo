import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import os from 'os';
import tuyaRoutes from './routes/tuya.js';
import { startDeviceMonitoring } from './services/deviceMonitor.js';
import { autoConfigureUserId } from './services/autoConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Fonction pour obtenir l'adresse IP locale
function getLocalIPAddress() {
  const nets = os.networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }

  return results;
}

// Middleware
// Configurer CORS pour accepter les connexions depuis tous les appareils
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/tuya', tuyaRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Serveur de domotique actif' });
});

// Endpoint pour obtenir les infos du serveur
app.get('/api/info', (req, res) => {
  const ips = getLocalIPAddress();
  res.json({
    status: 'OK',
    host: os.hostname(),
    localIPs: ips,
    port: PORT,
    accessURLs: ips.map(ip => `http://${ip}:${PORT}`),
  });
});

// Démarrage du serveur
app.listen(PORT, '0.0.0.0', async () => {
  const ips = getLocalIPAddress();

  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       🏠 SERVEUR DOMOTIQUE DÉMARRÉ AVEC SUCCÈS 🏠        ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  console.log('📡 Accès LOCAL :');
  console.log(`   → http://localhost:${PORT}`);
  console.log(`   → http://127.0.0.1:${PORT}\n`);

  if (ips.length > 0) {
    console.log('📱 Accès RÉSEAU (depuis téléphones/tablettes) :');
    ips.forEach(ip => {
      console.log(`   → http://${ip}:${PORT}`);
    });
    console.log('\n💡 Partagez ces URLs avec votre famille !\n');
  }

  console.log('🌐 Pour accès INTERNET (depuis n\'importe où) :');
  console.log('   → Utilisez le script: npm run tunnel');
  console.log('   → Ou consultez le fichier ACCES_INTERNET.md\n');

  console.log('═══════════════════════════════════════════════════════════\n');

  // Configuration automatique du User ID si nécessaire
  if (!process.env.TUYA_USER_ID) {
    console.log('⏳ Configuration automatique du User ID...\n');
    await autoConfigureUserId();
    console.log('');
  }

  // Démarrer la surveillance des appareils toutes les 30 secondes
  startDeviceMonitoring();
});

export default app;
