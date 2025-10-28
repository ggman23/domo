import tuyaAPI from '../config/tuya.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Fonction pour récupérer automatiquement le User ID
export async function autoConfigureUserId() {
  try {
    console.log('🔍 Recherche automatique du User ID...');

    // Obtenir le token d'accès
    await tuyaAPI.getAccessToken();

    // Essayer de récupérer les informations du compte
    // Tuya API v1.0/users/{uid}/infos nécessite le UID, donc on va lister les devices liés

    // On va essayer de récupérer la liste des utilisateurs liés au projet
    try {
      const result = await tuyaAPI.request('GET', '/v1.0/devices');

      if (result && result.length > 0) {
        // Extraire le UID du premier appareil
        const firstDevice = result[0];
        const uid = firstDevice.uid;

        if (uid) {
          console.log(`✅ User ID trouvé automatiquement : ${uid}`);

          // Mettre à jour le fichier .env
          const envPath = path.join(__dirname, '..', '.env');
          let envContent = fs.readFileSync(envPath, 'utf-8');

          // Remplacer ou ajouter TUYA_USER_ID
          if (envContent.includes('TUYA_USER_ID=')) {
            envContent = envContent.replace(/TUYA_USER_ID=.*/g, `TUYA_USER_ID=${uid}`);
          } else {
            envContent += `\nTUYA_USER_ID=${uid}\n`;
          }

          fs.writeFileSync(envPath, envContent);

          // Mettre à jour process.env
          process.env.TUYA_USER_ID = uid;

          console.log('✅ Fichier .env mis à jour avec le User ID');
          return uid;
        }
      }
    } catch (error) {
      console.error('⚠️  Impossible de récupérer automatiquement le User ID:', error.message);
    }

    // Alternative : essayer de récupérer via l'endpoint des utilisateurs
    try {
      const users = await tuyaAPI.request('GET', '/v1.0/iot-01/associated-users/actions/query');

      if (users && users.list && users.list.length > 0) {
        const uid = users.list[0].uid;

        console.log(`✅ User ID trouvé via associated-users : ${uid}`);

        // Mettre à jour le fichier .env
        const envPath = path.join(__dirname, '..', '.env');
        let envContent = fs.readFileSync(envPath, 'utf-8');

        if (envContent.includes('TUYA_USER_ID=')) {
          envContent = envContent.replace(/TUYA_USER_ID=.*/g, `TUYA_USER_ID=${uid}`);
        } else {
          envContent += `\nTUYA_USER_ID=${uid}\n`;
        }

        fs.writeFileSync(envPath, envContent);
        process.env.TUYA_USER_ID = uid;

        console.log('✅ Fichier .env mis à jour avec le User ID');
        return uid;
      }
    } catch (error) {
      console.error('⚠️  Erreur lors de la récupération des utilisateurs:', error.message);
    }

    console.log('⚠️  Impossible de récupérer automatiquement le User ID');
    console.log('📝 Veuillez le configurer manuellement dans le fichier .env');
    console.log('   Ou via l\'interface web de l\'application');

    return null;
  } catch (error) {
    console.error('❌ Erreur lors de la configuration automatique:', error.message);
    return null;
  }
}

// Fonction pour obtenir l'adresse IP locale
export function getLocalIPAddress() {
  const { networkInterfaces } = await import('os');
  const nets = networkInterfaces();
  const results = [];

  for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
      // Skip internal (i.e. 127.0.0.1) and non-IPv4 addresses
      if (net.family === 'IPv4' && !net.internal) {
        results.push(net.address);
      }
    }
  }

  return results[0] || 'localhost';
}
