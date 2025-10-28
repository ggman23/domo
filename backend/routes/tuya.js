import express from 'express';
import tuyaAPI from '../config/tuya.js';
import { getDevicesCache, getDeviceStatusCache } from '../services/deviceMonitor.js';

const router = express.Router();

// Récupère tous les appareils
router.get('/devices', async (req, res) => {
  try {
    // Utiliser le cache si disponible
    const cachedDevices = getDevicesCache();
    if (cachedDevices) {
      return res.json({ success: true, devices: cachedDevices });
    }

    // Sinon, demander à l'utilisateur de fournir son User ID
    res.status(400).json({
      success: false,
      message: 'Veuillez fournir votre User ID Tuya. Utilisez /devices/:userId',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Récupère les appareils d'un utilisateur
router.get('/devices/:userId', async (req, res) => {
  try {
    const devices = await tuyaAPI.getDevices(req.params.userId);
    res.json({ success: true, devices });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Récupère les informations d'un appareil spécifique
router.get('/device/:deviceId', async (req, res) => {
  try {
    const device = await tuyaAPI.getDeviceInfo(req.params.deviceId);
    res.json({ success: true, device });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Récupère le statut d'un appareil
router.get('/device/:deviceId/status', async (req, res) => {
  try {
    // Utiliser le cache si disponible
    const cachedStatus = getDeviceStatusCache(req.params.deviceId);
    if (cachedStatus) {
      return res.json({ success: true, status: cachedStatus });
    }

    const status = await tuyaAPI.getDeviceStatus(req.params.deviceId);
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Contrôle un appareil
router.post('/device/:deviceId/control', async (req, res) => {
  try {
    const { commands } = req.body;
    const result = await tuyaAPI.controlDevice(req.params.deviceId, commands);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Allume un appareil
router.post('/device/:deviceId/on', async (req, res) => {
  try {
    const result = await tuyaAPI.turnOn(req.params.deviceId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Éteint un appareil
router.post('/device/:deviceId/off', async (req, res) => {
  try {
    const result = await tuyaAPI.turnOff(req.params.deviceId);
    res.json({ success: true, result });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;
