// Endpoint de test pour déboguer la signature Tuya
import getTuyaAPI from './_tuya.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    console.log('🧪 Test de connexion Tuya...');

    const tuyaAPI = getTuyaAPI();

    // Essayer d'obtenir le token
    const token = await tuyaAPI.getAccessToken();

    return res.status(200).json({
      success: true,
      message: '✅ Connexion Tuya réussie !',
      tokenObtained: !!token,
      tokenLength: token ? token.length : 0,
    });

  } catch (error) {
    console.error('❌ Test échoué:', error);

    return res.status(500).json({
      success: false,
      message: '❌ Échec de la connexion Tuya',
      error: error.message,
      details: error.response?.data || null,
    });
  }
}
