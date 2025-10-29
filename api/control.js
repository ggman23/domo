// Control device - version autonome
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
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Méthode non autorisée',
    });
  }

  const { deviceId, action } = req.query;
  const { commands } = req.body;

  if (!deviceId) {
    return res.status(400).json({
      success: false,
      message: 'Device ID requis',
    });
  }

  try {
    // Obtenir le token
    const accessToken = await getToken();

    let commandsToSend = commands;

    // Actions prédéfinies - essayer switch_1 ET switch pour compatibilité
    if (action === 'on') {
      commandsToSend = [
        { code: 'switch_1', value: true },
        { code: 'switch', value: true },
        { code: 'switch_led', value: true } // Pour les ampoules
      ];
    } else if (action === 'off') {
      commandsToSend = [
        { code: 'switch_1', value: false },
        { code: 'switch', value: false },
        { code: 'switch_led', value: false } // Pour les ampoules
      ];
    }

    if (!commandsToSend || !Array.isArray(commandsToSend)) {
      return res.status(400).json({
        success: false,
        message: 'Commandes invalides',
      });
    }

    console.log('🎮 Control request:', {
      deviceId,
      action,
      commands: commandsToSend
    });

    // Requête pour contrôler le device
    const method = 'POST';
    const path = `/v1.0/devices/${deviceId}/commands`;
    const timestamp = Date.now().toString();
    const bodyStr = JSON.stringify({ commands: commandsToSend });
    const contentHash = crypto.createHash('sha256').update(bodyStr, 'utf8').digest('hex');

    const url = path;
    const stringToSign = method + '\n' + contentHash + '\n' + '\n' + url;
    const signStr = CREDS.clientId + accessToken + timestamp + stringToSign;
    const signature = crypto.createHmac('sha256', CREDS.clientSecret).update(signStr, 'utf8').digest('hex').toUpperCase();

    const response = await axios({
      method: 'POST',
      url: CREDS.baseUrl + path,
      headers: {
        client_id: CREDS.clientId,
        sign: signature,
        t: timestamp,
        sign_method: 'HMAC-SHA256',
        access_token: accessToken,
        'Content-Type': 'application/json',
      },
      data: { commands: commandsToSend },
    });

    console.log('✅ Tuya response:', {
      success: response.data.success,
      code: response.data.code,
      msg: response.data.msg,
      result: response.data.result
    });

    if (!response.data.success) {
      console.error('❌ Tuya error:', response.data);
      return res.status(500).json({
        success: false,
        message: response.data.msg || 'Erreur Tuya',
        code: response.data.code,
        details: response.data
      });
    }

    return res.status(200).json({
      success: true,
      result: response.data.result,
    });

  } catch (error) {
    console.error('❌ Control error:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    const errorMsg = error.response?.data?.msg || error.message;
    const errorCode = error.response?.data?.code;

    return res.status(500).json({
      success: false,
      message: `Erreur: ${errorMsg}${errorCode ? ` (code: ${errorCode})` : ''}`,
      details: {
        error: errorMsg,
        code: errorCode,
        fullError: error.response?.data
      }
    });
  }
}
