// Test de requête AVEC token (obtenir devices)
import crypto from 'crypto';
import axios from 'axios';

const CREDS = {
  clientId: 'ktuq7y5tgtw5433v8r4s',
  clientSecret: '74c7023cc90946128ca8b6f887a4e5cb',
  baseUrl: 'https://openapi.tuyaeu.com',
};

async function getToken() {
  const method = 'GET';
  const path = '/v1.0/token';
  const timestamp = Date.now().toString();
  const queryString = 'grant_type=1';

  const contentHash = crypto.createHash('sha256').update('', 'utf8').digest('hex');
  const url = path + '?' + queryString;
  const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;
  const signStr = CREDS.clientId + timestamp + stringToSign;
  const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

  const response = await axios({
    method: 'GET',
    url: CREDS.baseUrl + path + '?' + queryString,
    headers: {
      client_id: CREDS.clientId,
      sign: signature,
      t: timestamp,
      sign_method: 'HMAC-SHA256',
    },
  });

  return response.data.result.access_token;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const details = {};

  try {
    details.step1_getToken = '🔑 Obtention du token...';
    const accessToken = await getToken();
    details.step1_result = {
      success: true,
      token: accessToken.substring(0, 30) + '...',
    };

    // MAINTENANT : Requête AVEC le token pour obtenir les devices
    const userId = 'eu16951695278972Gsux';
    details.step2_withToken = `📱 Requête avec token pour /v1.0/users/${userId}/devices`;

    const method = 'GET';
    const path = `/v1.0/users/${userId}/devices`;
    const timestamp = Date.now().toString();

    // Paramètres de pagination pour récupérer TOUS les appareils (max 100)
    const queryString = 'page_no=0&page_size=100';
    const contentHash = crypto.createHash('sha256').update('', 'utf8').digest('hex');

    // URL pour la signature AVEC query string
    const url = path + '?' + queryString;
    const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;

    // AVEC TOKEN : clientId + accessToken + timestamp + stringToSign
    const signStr = CREDS.clientId + accessToken + timestamp + stringToSign;
    const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

    details.step2_signature = {
      method,
      path,
      timestamp,
      contentHash,
      url,
      stringToSign,
      signStrFormula: 'clientId + accessToken + timestamp + stringToSign',
      signature: signature.substring(0, 30) + '...',
    };

    const response = await axios({
      method: 'GET',
      url: CREDS.baseUrl + path + '?' + queryString,
      headers: {
        client_id: CREDS.clientId,
        sign: signature,
        t: timestamp,
        sign_method: 'HMAC-SHA256',
        access_token: accessToken,
      },
    });

    details.step2_response = {
      status: response.status,
      success: response.data.success,
      code: response.data.code,
      msg: response.data.msg,
      deviceCount: response.data.result?.length || 0,
    };

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: '✅ SUCCÈS ! Requête avec token fonctionne !',
        details,
        devices: response.data.result,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '❌ ÉCHEC avec token',
        details,
        error: response.data,
      });
    }

  } catch (error) {
    details.error = {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };

    return res.status(500).json({
      success: false,
      message: '❌ Erreur',
      details,
      error: error.response?.data || error.message,
    });
  }
}
