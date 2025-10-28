import cron from 'node-cron';
import tuyaAPI from '../config/tuya.js';

// Cache pour stocker les données des appareils
let devicesCache = null;
let deviceStatusCache = new Map();

// Fonction pour mettre à jour le cache des appareils
export async function updateDevicesCache(userId) {
  try {
    if (!userId) {
      console.log('⚠️  User ID non configuré. Utilisez la variable d\'environnement TUYA_USER_ID');
      return;
    }

    const devices = await tuyaAPI.getDevices(userId);
    devicesCache = devices;

    // Mettre à jour le statut de chaque appareil
    for (const device of devices) {
      try {
        const status = await tuyaAPI.getDeviceStatus(device.id);
        deviceStatusCache.set(device.id, {
          status,
          timestamp: Date.now(),
        });
      } catch (error) {
        console.error(`⚠️  Erreur lors de la mise à jour du statut de ${device.name}:`, error.message);
      }
    }

    console.log(`✅ Cache mis à jour: ${devices.length} appareils`);
  } catch (error) {
    console.error('❌ Erreur lors de la mise à jour du cache:', error.message);
  }
}

// Démarre la surveillance périodique des appareils
export function startDeviceMonitoring() {
  const userId = process.env.TUYA_USER_ID;

  if (!userId) {
    console.log('⚠️  TUYA_USER_ID non configuré. La surveillance automatique est désactivée.');
    console.log('   Configurez TUYA_USER_ID dans le fichier .env pour activer la surveillance.');
    return;
  }

  console.log('🔄 Démarrage de la surveillance des appareils...');

  // Mise à jour initiale
  updateDevicesCache(userId);

  // Mise à jour toutes les 30 secondes
  cron.schedule('*/30 * * * * *', () => {
    updateDevicesCache(userId);
  });
}

// Récupère le cache des appareils
export function getDevicesCache() {
  return devicesCache;
}

// Récupère le statut en cache d'un appareil
export function getDeviceStatusCache(deviceId) {
  const cached = deviceStatusCache.get(deviceId);
  if (cached && Date.now() - cached.timestamp < 60000) { // Cache valide pendant 1 minute
    return cached.status;
  }
  return null;
}
