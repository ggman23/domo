// Serveur unifié pour Railway
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Import des routes API
import getTuyaAPI from './api/_tuya.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
}));
app.use(express.json());

// ==================== ROUTES API ====================

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'API Domotique en ligne',
    timestamp: new Date().toISOString(),
  });
});

// Debug endpoint
app.get('/api/debug', (req, res) => {
  const envCheck = {
    TUYA_CLIENT_ID: process.env.TUYA_CLIENT_ID ? `${process.env.TUYA_CLIENT_ID.substring(0, 5)}...` : '❌ MANQUANT',
    TUYA_CLIENT_SECRET: process.env.TUYA_CLIENT_SECRET ? '✓ Défini (caché)' : '❌ MANQUANT',
    TUYA_REGION: process.env.TUYA_REGION || 'eu (par défaut)',
    nodeVersion: process.version,
    platform: process.platform,
  };

  res.json({
    success: true,
    message: 'Diagnostic des variables d\'environnement',
    environment: envCheck,
    allEnvVarsCount: Object.keys(process.env).length,
  });
});

// User ID auto-discovery
app.get('/api/userid', async (req, res) => {
  try {
    const tuyaAPI = getTuyaAPI();

    // Auto-découverte du User ID
    try {
      const devices = await tuyaAPI.request('GET', '/v1.0/devices');

      if (devices && devices.length > 0) {
        const uid = devices[0].uid;
        return res.status(200).json({
          success: true,
          userId: uid,
          message: 'User ID trouvé automatiquement',
        });
      }
    } catch (error) {
      console.error('Erreur devices:', error.message);
    }

    // Alternative
    try {
      const users = await tuyaAPI.request('GET', '/v1.0/iot-01/associated-users/actions/query');

      if (users && users.list && users.list.length > 0) {
        const uid = users.list[0].uid;
        return res.status(200).json({
          success: true,
          userId: uid,
          message: 'User ID trouvé via associated-users',
        });
      }
    } catch (error) {
      console.error('Erreur users:', error.message);
    }

    return res.status(404).json({
      success: false,
      message: 'Impossible de trouver le User ID automatiquement',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get devices
app.get('/api/devices', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'User ID requis',
    });
  }

  try {
    const tuyaAPI = getTuyaAPI();
    const devices = await tuyaAPI.request('GET', `/v1.0/users/${userId}/devices`);

    return res.status(200).json({
      success: true,
      devices: devices || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get device status
app.get('/api/status', async (req, res) => {
  const { deviceId } = req.query;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID requis',
    });
  }

  try {
    const tuyaAPI = getTuyaAPI();
    const status = await tuyaAPI.request('GET', `/v1.0/devices/${deviceId}/status`);

    return res.status(200).json({
      success: true,
      status: status || [],
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Control device
app.post('/api/control', async (req, res) => {
  const { deviceId, action } = req.query;
  const { commands } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID requis',
    });
  }

  try {
    const tuyaAPI = getTuyaAPI();

    let commandsToSend = commands;

    // Actions prédéfinies
    if (action === 'on') {
      commandsToSend = [{ code: 'switch_1', value: true }];
    } else if (action === 'off') {
      commandsToSend = [{ code: 'switch_1', value: false }];
    }

    if (!commandsToSend || !Array.isArray(commandsToSend)) {
      return res.status(400).json({
        success: false,
        message: 'Commandes invalides',
      });
    }

    const result = await tuyaAPI.request('POST', `/v1.0/devices/${deviceId}/commands`, {
      commands: commandsToSend,
    });

    return res.status(200).json({
      success: true,
      result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// ==================== SERVIR LE FRONTEND ====================

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'frontend', 'dist')));

// Toutes les autres routes renvoient index.html (pour le routing SPA)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

// ==================== DÉMARRAGE ====================

app.listen(PORT, '0.0.0.0', () => {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║       🚂 SERVEUR RAILWAY DÉMARRÉ AVEC SUCCÈS 🚂         ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');
  console.log(`🌐 Serveur en écoute sur le port ${PORT}\n`);
  console.log('✅ Frontend : Servi depuis /frontend/dist');
  console.log('✅ API : Disponible sur /api/*\n');
  console.log('═══════════════════════════════════════════════════════════\n');
});

export default app;
