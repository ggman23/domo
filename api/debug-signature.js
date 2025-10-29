// Test ultra-détaillé de la signature Tuya - affiche CHAQUE étape
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

  const details = {
    step1_inputs: {},
    step2_params: {},
    step3_contentHash: {},
    step4_stringToSign: {},
    step5_signStr: {},
    step6_signature: {},
    step7_request: {},
    step8_response: {},
  };

  try {
    // ÉTAPE 1 : Inputs
    const method = 'GET';
    const path = '/v1.0/token';
    const timestamp = Date.now().toString();

    details.step1_inputs = {
      method,
      path,
      timestamp,
      clientId: CREDS.clientId,
      clientSecret: CREDS.clientSecret.substring(0, 10) + '...',
    };

    // ÉTAPE 2 : Query params
    const params = { grant_type: 1 };
    const queryString = 'grant_type=1';

    details.step2_params = {
      params,
      queryString,
    };

    // ÉTAPE 3 : Content Hash (SHA256 du body, vide pour GET)
    const body = '';
    const contentHash = crypto
      .createHash('sha256')
      .update(body, 'utf8')
      .digest('hex');

    details.step3_contentHash = {
      body: body || '(vide)',
      bodyLength: body.length,
      contentHash,
    };

    // ÉTAPE 4 : String to Sign
    // Format Tuya: Method + "\n" + ContentHash + "\n" + Headers + "\n" + URL
    const url = path + '?' + queryString;
    const headers = ''; // Vide pour Tuya
    const stringToSign = method + '\n' + contentHash + '\n' + headers + '\n' + url;

    details.step4_stringToSign = {
      url,
      headers: headers || '(vide)',
      stringToSignParts: [method, contentHash, headers, url],
      stringToSign,
      stringToSignLength: stringToSign.length,
    };

    // ÉTAPE 5 : Sign String
    // Pour l'obtention du token: clientId + timestamp + stringToSign
    const signStr = CREDS.clientId + timestamp + stringToSign;

    details.step5_signStr = {
      formula: 'clientId + timestamp + stringToSign',
      clientId: CREDS.clientId,
      timestamp,
      signStr,
      signStrLength: signStr.length,
    };

    // ÉTAPE 6 : Signature HMAC-SHA256
    const signature = crypto
      .createHmac('sha256', CREDS.clientSecret)
      .update(signStr, 'utf8')
      .digest('hex')
      .toUpperCase();

    details.step6_signature = {
      algorithm: 'HMAC-SHA256',
      secret: CREDS.clientSecret.substring(0, 10) + '...',
      signature,
      signatureLength: signature.length,
    };

    // ÉTAPE 7 : Requête HTTP
    const fullUrl = CREDS.baseUrl + path + '?' + queryString;
    const requestHeaders = {
      client_id: CREDS.clientId,
      sign: signature,
      t: timestamp,
      sign_method: 'HMAC-SHA256',
    };

    details.step7_request = {
      method,
      url: fullUrl,
      headers: requestHeaders,
    };

    // ÉTAPE 8 : Appel à Tuya
    const response = await axios({
      method,
      url: fullUrl,
      headers: requestHeaders,
    });

    details.step8_response = {
      status: response.status,
      success: response.data.success,
      code: response.data.code,
      msg: response.data.msg,
      t: response.data.t,
      hasResult: !!response.data.result,
    };

    if (response.data.success) {
      return res.status(200).json({
        success: true,
        message: '✅ SUCCÈS ! La signature est correcte !',
        details,
        token: response.data.result.access_token.substring(0, 30) + '...',
      });
    } else {
      return res.status(400).json({
        success: false,
        message: '❌ ÉCHEC - Signature invalide',
        details,
        tuyaError: response.data,
      });
    }

  } catch (error) {
    details.step8_response = {
      error: true,
      message: error.message,
      status: error.response?.status,
      data: error.response?.data,
    };

    return res.status(500).json({
      success: false,
      message: '❌ Erreur lors de l\'appel',
      details,
      error: error.response?.data || error.message,
    });
  }
}
