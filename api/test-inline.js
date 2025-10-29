// Test EXACTEMENT comme test-with-token mais directement dans l'endpoint
import crypto from 'crypto';
import axios from 'axios';

const CREDS = {
  clientId: 'ktuq7y5tgtw5433v8r4s',
  clientSecret: '74c7023cc90946128ca8b6f887a4e5cb',
  baseUrl: 'https://openapi.tuyaeu.com',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { userId } = req.query;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID requis' });
  }

  try {
    // ÉTAPE 1 : Obtenir le token (copie exacte de test-with-token.js)
    console.log('🔑 Obtention token...');
    const method1 = 'GET';
    const path1 = '/v1.0/token';
    const timestamp1 = Date.now().toString();
    const queryString1 = 'grant_type=1';
    const contentHash1 = crypto.createHash('sha256').update('', 'utf8').digest('hex');
    const url1 = path1 + '?' + queryString1;
    const stringToSign1 = method1 + '\n' + contentHash1 + '\n' + '\n' + url1;
    const signStr1 = CREDS.clientId + timestamp1 + stringToSign1;
    const signature1 = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr1, 'utf8').digest('hex').toUpperCase();

    const response1 = await axios({
      method: 'GET',
      url: CREDS.baseUrl + path1 + '?' + queryString1,
      headers: {
        client_id: CREDS.clientId,
        sign: signature1,
        t: timestamp1,
        sign_method: 'HMAC-SHA256',
      },
    });

    if (!response1.data.success) {
      return res.status(500).json({ success: false, message: 'Erreur token: ' + response1.data.msg });
    }

    const accessToken = response1.data.result.access_token;
    console.log('✅ Token obtenu:', accessToken);

    // ÉTAPE 2 : Requête devices AVEC le token (copie exacte de test-with-token.js)
    console.log('📱 Requête devices...');
    const method2 = 'GET';
    const path2 = `/v1.0/users/${userId}/devices`;
    const timestamp2 = Date.now().toString();
    const contentHash2 = crypto.createHash('sha256').update('', 'utf8').digest('hex');
    const url2 = path2;
    const stringToSign2 = method2 + '\n' + contentHash2 + '\n' + '\n' + url2;
    const signStr2 = CREDS.clientId + accessToken + timestamp2 + stringToSign2;
    const signature2 = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr2, 'utf8').digest('hex').toUpperCase();

    const response2 = await axios({
      method: 'GET',
      url: CREDS.baseUrl + path2,
      headers: {
        client_id: CREDS.clientId,
        sign: signature2,
        t: timestamp2,
        sign_method: 'HMAC-SHA256',
        access_token: accessToken,
      },
    });

    if (!response2.data.success) {
      return res.status(500).json({
        success: false,
        message: 'Erreur devices: ' + response2.data.msg,
        debug: {
          accessToken,
          timestamp2,
          signature2: signature2.substring(0, 20),
        }
      });
    }

    console.log('✅ Devices récupérés:', response2.data.result.length);

    return res.status(200).json({
      success: true,
      devices: response2.data.result || [],
    });

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    return res.status(500).json({
      success: false,
      message: error.message,
      details: error.response?.data,
    });
  }
}
