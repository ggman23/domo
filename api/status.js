// Get device status - version autonome
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée',
    });
  }

  const { deviceId } = req.query;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID requis',
    });
  }

  try {
    // Obtenir le token
    const accessToken = await getToken();

    // Requête pour obtenir le statut du device
    const method = 'GET';
    const path = `/v1.0/devices/${deviceId}/status`;
    const timestamp = Date.now().toString();
    const contentHash = crypto.createHash('sha256').update('', 'utf8').digest('hex');

    const url = path;
    const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;
    const signStr = CREDS.clientId + accessToken + timestamp + stringToSign;
    const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

    const response = await axios({
      method: 'GET',
      url: CREDS.baseUrl + path,
      headers: {
        client_id: CREDS.clientId,
        sign: signature,
        t: timestamp,
        sign_method: 'HMAC-SHA256',
        access_token: accessToken,
      },
    });

    if (!response.data.success) {
      return res.status(500).json({ success: false, message: response.data.msg });
    }

    return res.status(200).json({
      success: true,
      status: response.data.result,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}
