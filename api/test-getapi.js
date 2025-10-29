// Test direct de getTuyaAPI().getAccessToken()
import getTuyaAPI from './_tuya.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const logs = [];

  try {
    logs.push('🧪 Test direct de getTuyaAPI()');
    logs.push('');

    logs.push('📍 Étape 1: Création de l\'instance');
    const tuyaAPI = getTuyaAPI();
    logs.push('✅ Instance créée');
    logs.push('');

    logs.push('📍 Étape 2: Appel de getAccessToken()');
    const token = await tuyaAPI.getAccessToken();
    logs.push('✅ Token obtenu !');
    logs.push(`   Token (début): ${token.substring(0, 30)}...`);
    logs.push('');

    return res.status(200).json({
      success: true,
      message: '✅ SUCCÈS avec getTuyaAPI() !',
      logs,
      token: token.substring(0, 30) + '...',
    });

  } catch (error) {
    logs.push('');
    logs.push('❌ ERREUR:');
    logs.push(`   Message: ${error.message}`);

    if (error.response?.data) {
      logs.push(`   Tuya Response: ${JSON.stringify(error.response.data)}`);
    }

    return res.status(500).json({
      success: false,
      message: '❌ Échec avec getTuyaAPI()',
      logs,
      error: error.response?.data || error.message,
    });
  }
}
