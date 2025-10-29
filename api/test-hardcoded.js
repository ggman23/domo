// Test avec credentials en dur pour déboguer
import crypto from 'crypto';
import axios from 'axios';

const CREDENTIALS = {
  clientId: 'ktuq7y5tgtw5433v8r4s',
  clientSecret: '74c7023cc90946128ca8b6f887a4e5cb',
  region: 'eu',
  baseUrl: 'https://openapi.tuyaeu.com',
};

function generateSignature(method, path, params, body, clientId, clientSecret) {
  const timestamp = Date.now().toString();

  // Construire la query string
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');

  // Hash du body
  const bodyToHash = body || '';
  const contentHash = crypto
    .createHash('sha256')
    .update(bodyToHash, 'utf8')
    .digest('hex');

  // Construire le stringToSign
  const url = path + (sortedParams ? `?${sortedParams}` : '');
  const stringToSign = [
    method,
    contentHash,
    '',
    url,
  ].join('\n');

  // Construire la chaîne à signer (sans token pour l'authentification)
  const signStr = clientId + timestamp + stringToSign;

  // Calculer la signature
  const signature = crypto
    .createHmac('sha256', clientSecret)
    .update(signStr, 'utf8')
    .digest('hex')
    .toUpperCase();

  return {
    timestamp,
    signature,
    clientId,
  };
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const logs = [];

  try {
    logs.push('🧪 Test avec credentials en dur');
    logs.push(`📍 Base URL: ${CREDENTIALS.baseUrl}`);
    logs.push(`📍 Client ID: ${CREDENTIALS.clientId}`);
    logs.push(`📍 Client Secret: ${CREDENTIALS.clientSecret.substring(0, 10)}...`);

    const path = '/v1.0/token';
    const method = 'GET';
    const params = { grant_type: 1 };

    logs.push('');
    logs.push('🔐 Génération de la signature...');

    const signData = generateSignature(
      method,
      path,
      params,
      '',
      CREDENTIALS.clientId,
      CREDENTIALS.clientSecret
    );

    logs.push(`   Timestamp: ${signData.timestamp}`);
    logs.push(`   Signature: ${signData.signature.substring(0, 30)}...`);

    const fullUrl = CREDENTIALS.baseUrl + path + '?grant_type=1';

    logs.push('');
    logs.push(`📡 Appel à: ${fullUrl}`);
    logs.push('   Headers:');
    logs.push(`     client_id: ${signData.clientId}`);
    logs.push(`     sign: ${signData.signature.substring(0, 30)}...`);
    logs.push(`     t: ${signData.timestamp}`);
    logs.push(`     sign_method: HMAC-SHA256`);

    const response = await axios({
      method,
      url: fullUrl,
      headers: {
        client_id: signData.clientId,
        sign: signData.signature,
        t: signData.timestamp,
        sign_method: 'HMAC-SHA256',
      },
    });

    logs.push('');
    logs.push('📥 Réponse Tuya:');
    logs.push(`   Success: ${response.data.success}`);
    logs.push(`   Code: ${response.data.code}`);
    logs.push(`   Message: ${response.data.msg || 'N/A'}`);

    if (response.data.success) {
      logs.push('');
      logs.push('✅ SUCCÈS ! La connexion fonctionne !');
      return res.status(200).json({
        success: true,
        message: '✅ Connexion Tuya réussie avec credentials en dur',
        logs,
        token: response.data.result.access_token.substring(0, 20) + '...',
      });
    } else {
      logs.push('');
      logs.push('❌ ÉCHEC de la connexion');
      return res.status(400).json({
        success: false,
        message: '❌ Échec malgré credentials en dur',
        logs,
        tuyaResponse: response.data,
      });
    }

  } catch (error) {
    logs.push('');
    logs.push('❌ ERREUR lors de l\'appel:');

    if (error.response) {
      logs.push(`   Status: ${error.response.status}`);
      logs.push(`   Data: ${JSON.stringify(error.response.data)}`);
    } else {
      logs.push(`   Message: ${error.message}`);
    }

    return res.status(500).json({
      success: false,
      message: '❌ Erreur réseau ou serveur',
      logs,
      error: error.response?.data || error.message,
    });
  }
}
